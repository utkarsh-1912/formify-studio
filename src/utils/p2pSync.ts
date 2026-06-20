import { useState, useEffect, useRef } from "react";

export type P2PStatus = "disconnected" | "connecting" | "hosting" | "joined" | "error";

const loadPeerLibrary = async (): Promise<any> => {
  try {
    const module = await import("peerjs");
    return module.default;
  } catch (err) {
    console.warn("Formify P2P: Dynamic chunk load failed. Falling back to CDN load...", err);
    return new Promise((resolve, reject) => {
      if (typeof window === "undefined") {
        reject(new Error("Cannot load PeerJS on server"));
        return;
      }
      if ((window as any).Peer) {
        resolve((window as any).Peer);
        return;
      }
      const script = document.createElement("script");
      script.src = "https://unpkg.com/peerjs@1.5.4/dist/peerjs.min.js";
      script.async = true;
      script.onload = () => {
        if ((window as any).Peer) {
          resolve((window as any).Peer);
        } else {
          reject(new Error("PeerJS not found on window"));
        }
      };
      script.onerror = (e) => {
        reject(new Error("Failed to load PeerJS from CDN"));
      };
      document.body.appendChild(script);
    });
  }
};

export function useP2PSync(
  workspaceId: string,
  localSchema: any,
  onRemoteSchema: (schema: any) => void
) {
  const [status, setStatus] = useState<P2PStatus>("disconnected");
  const [peerId, setPeerId] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [connectedPeers, setConnectedPeers] = useState<string[]>([]);

  const peerRef = useRef<any>(null);
  const connectionsRef = useRef<any[]>([]);
  const isUpdatingRef = useRef(false);

  // Helper to dynamically load PeerJS on the client side only (prevents Next.js SSR build errors)
  const initPeerJS = async () => {
    try {
      setStatus("connecting");
      const PeerClass = await loadPeerLibrary();
      
      // Determine unique Peer ID based on role
      const myId = `formify-ws-${workspaceId}-${Math.random().toString(36).substring(2, 6)}`;
      setPeerId(myId);

      const peer = new PeerClass(myId, {
        host: "0.peerjs.com",
        secure: true,
        port: 443
      });

      peerRef.current = peer;

      peer.on("open", (id: string) => {
        console.log("PeerJS Connection Open. ID:", id);
        // Try to connect to other existing hosts/peers in the same workspace automatically
        autoConnectToPeers(id);
      });

      peer.on("connection", (conn: any) => {
        console.log("Received P2P connection request from:", conn.peer);
        setupConnectionEvents(conn);
      });

      peer.on("error", (err: any) => {
        console.error("PeerJS Client Error:", err);
        
        // SELF-HEALING: If host peer is offline/unavailable, promote myself to host
        if (err.type === "peer-unavailable") {
          console.log("P2P Host unavailable. Recreating client as workspace host.");
          const hostId = `formify-ws-${workspaceId}-host`;
          recreateAsHost(hostId);
          return;
        }

        setErrorMessage(err.type || "Peer connection error");
        setStatus("error");
      });
    } catch (e) {
      console.error("Failed to initialize PeerJS:", e);
      setErrorMessage("Failed to load P2P sync libraries.");
      setStatus("error");
    }
  };

  const setupConnectionEvents = (conn: any) => {
    if (!connectionsRef.current.some((c) => c.peer === conn.peer)) {
      connectionsRef.current.push(conn);
      setConnectedPeers((prev) => Array.from(new Set([...prev, conn.peer])));
    }

    conn.on("open", () => {
      console.log("Data connection established with:", conn.peer);
      // Immediately send current schema state to newly connected peer
      conn.send({ type: "SYNC_SCHEMA", schema: localSchema });
    });

    conn.on("data", (data: any) => {
      if (!data || typeof data !== "object") return;

      if (data.type === "SYNC_SCHEMA") {
        console.log("P2P Schema Sync payload received from:", conn.peer);
        isUpdatingRef.current = true;
        onRemoteSchema(data.schema);
        setTimeout(() => {
          isUpdatingRef.current = false;
        }, 100);
      }
    });

    conn.on("close", () => {
      console.log("Connection closed with:", conn.peer);
      connectionsRef.current = connectionsRef.current.filter((c) => c.peer !== conn.peer);
      setConnectedPeers((prev) => prev.filter((p) => p !== conn.peer));
    });
  };

  const autoConnectToPeers = async (myId: string) => {
    if (!peerRef.current) return;
    
    const hostId = `formify-ws-${workspaceId}-host`;
    if (myId === hostId) {
      setStatus("hosting");
      return;
    }

    console.log("Attempting auto-connection to workspace host:", hostId);
    const conn = peerRef.current.connect(hostId, {
      reliable: true
    });
    
    conn.on("open", () => {
      setupConnectionEvents(conn);
      setStatus("joined");
    });
  };

  const recreateAsHost = async (hostId: string) => {
    if (peerRef.current) {
      peerRef.current.destroy();
    }
    
    try {
      const PeerClass = await loadPeerLibrary();
      const peer = new PeerClass(hostId, {
        host: "0.peerjs.com",
        secure: true,
        port: 443
      });

      peerRef.current = peer;
      setPeerId(hostId);

      peer.on("open", () => {
        setStatus("hosting");
        console.log("Acting as workspace host peer at ID:", hostId);
      });

      peer.on("connection", (conn: any) => {
        setupConnectionEvents(conn);
      });

      peer.on("error", (err: any) => {
        console.error("PeerJS Host Error:", err);
        // If host ID is taken, another peer has registered it. Re-initialize as client.
        if (err.type === "unavailable-id") {
          console.log("Host ID taken. Falling back to client peer connection.");
          setTimeout(() => {
            initPeerJS();
          }, 500);
        } else {
          setErrorMessage(err.type || "Host socket error");
          setStatus("error");
        }
      });
    } catch (e) {
      console.error("Failed to recreate peer as host:", e);
      setStatus("error");
    }
  };

  const broadcastSchema = (updatedSchema: any) => {
    if (isUpdatingRef.current) return;
    if (connectionsRef.current.length === 0) return;

    connectionsRef.current.forEach((conn) => {
      if (conn.open) {
        conn.send({ type: "SYNC_SCHEMA", schema: updatedSchema });
      }
    });
  };

  const disconnect = () => {
    if (peerRef.current) {
      peerRef.current.destroy();
      peerRef.current = null;
    }
    connectionsRef.current = [];
    setConnectedPeers([]);
    setStatus("disconnected");
  };

  useEffect(() => {
    if (status === "hosting" || status === "joined") {
      broadcastSchema(localSchema);
    }
  }, [localSchema]);

  useEffect(() => {
    return () => {
      if (peerRef.current) {
        peerRef.current.destroy();
      }
    };
  }, []);

  return {
    status,
    peerId,
    errorMessage,
    connectedPeers,
    initPeerJS,
    disconnect,
    push: () => broadcastSchema(localSchema)
  };
}
