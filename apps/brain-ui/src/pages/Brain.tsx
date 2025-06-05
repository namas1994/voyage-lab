import { useEffect, useState } from "react";
import "./../App.css";
import { useAppConfig } from "../context/AppConfigContext";

type Knowledge = {
  id: string;
  name: string;
  description: string;
};
type KnowledgeE = {
  error: string;
};

export function Brain() {
  const [knowledge, setKnowledge] = useState<Knowledge[]>([]);
  const [topicId, setTopicId] = useState("");
  const [topic, setTopic] = useState<Knowledge | KnowledgeE>({
    id: "",
    name: "",
    description: ""
  });
  const { vlApiUrl } = useAppConfig();
  const [newTopic, setNewTopic] = useState({
    id: "",
    name: "",
    description: ""
  });
  const [message, setMessage] = useState("");

  // Fetch all knowledge topics
  useEffect(() => {
    fetch(new URL("/knowledge", vlApiUrl))
      .then((res) => res.json())
      .then(setKnowledge);
  }, [vlApiUrl]);

  // Fetch a specific topic
  const fetchTopic = () => {
    if (!topicId) return;
    fetch(new URL(`/knowledge/${topicId}`, vlApiUrl))
      .then((res) => res.json())
      .then((data) => setTopic(data));
  };

  // Add a new topic
  const addTopic = (e: React.FormEvent) => {
    e.preventDefault();

    fetch(new URL("/knowledge", vlApiUrl), {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newTopic)
    })
      .then(async (res) => {
        if (res.ok) {
          const data = await res.json();
          setKnowledge((prev) => [...prev, data]);
          setMessage("Topic added!");
        } else {
          const err = await res.json();
          setMessage(err.error || "Error adding topic");
        }
      })
      .catch(() => setMessage("Network error"));
  };

  return (
    <div className="App">
      <h1>Knowledge Topics</h1>
      <ul>
        {knowledge.map((k) => (
          <li key={k.id}>
            <strong>{k.name}</strong>: {k.description}
          </li>
        ))}
      </ul>

      <h2>Get Topic by ID</h2>
      <input
        value={topicId}
        onChange={(e) => setTopicId(e.target.value)}
        placeholder="Enter topic id"
      />
      <button onClick={fetchTopic}>Fetch Topic</button>
      {topic && "error" in topic && topic ? (
        <div style={{ color: "red" }}>{topic.error}</div>
      ) : (
        <div>
          <h3>{topic.name}</h3>
          <p>{topic.description}</p>
        </div>
      )}

      <h2>Add New Topic</h2>
      <form onSubmit={addTopic}>
        <input
          value={newTopic.id}
          onChange={(e) => setNewTopic({ ...newTopic, id: e.target.value })}
          placeholder="ID"
          required
        />
        <input
          value={newTopic.name}
          onChange={(e) => setNewTopic({ ...newTopic, name: e.target.value })}
          placeholder="Name"
          required
        />
        <input
          value={newTopic.description}
          onChange={(e) =>
            setNewTopic({ ...newTopic, description: e.target.value })
          }
          placeholder="Description"
        />
        <button type="submit">Add Topic</button>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
}
