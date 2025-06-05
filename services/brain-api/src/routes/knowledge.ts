import express, { Router, NextFunction, Request, Response } from "express";
const KnowledgeRouter = express.Router() as Router;

type TKnowledgeTopicParam = { topicId: string };

type TKnowledgeTopic = { id: string; name: string; description?: string };
type TKnowledgeTopics = TKnowledgeTopic[];
type TKnowledgeError = { error: string };
// Test data for knowledge topics
const knowledge: TKnowledgeTopics = [
  {
    id: "math",
    name: "Mathematics",
    description: "Numbers, equations, and logic."
  },
  {
    id: "history",
    name: "History",
    description: "Events and people from the past."
  }
];

// GET /knowledge: Retrieve a list of available knowledge topics
KnowledgeRouter.get("/", (_req: Request, res: Response) => {
  res.json(knowledge);
});

// GET /knowledge/:topicId: Get specific information related to a knowledge topic
KnowledgeRouter.get(
  "/:topicId",
  (
    req: Request<TKnowledgeTopicParam>,
    res: Response<TKnowledgeTopic | TKnowledgeError>
  ) => {
    const topic = knowledge.find((k) => k.id === req.params.topicId);
    if (topic) {
      res.json(topic);
    } else {
      res.status(404).json({ error: "Topic not found" });
    }
  }
);

KnowledgeRouter.post(
  "/",
  (
    req: Request<{}, {}, TKnowledgeTopic>,
    res: Response<TKnowledgeTopic | TKnowledgeError>,
    next: NextFunction
  ) => {
    const { id, name, description } = req.body;
    if (!id || !name) {
      res.status(400).json({ error: "id and name are required" }).send();
    }
    if (knowledge.find((k) => k.id === id)) {
      res
        .status(409)
        .json({ error: "Topic with this id already exists" })
        .send();
      return next();
    }
    const newTopic = { id, name, description: description || "" };
    knowledge.push(newTopic);
    res.status(201).json(newTopic).send();
  }
);

KnowledgeRouter.all(
  "/",
  (_req: Request, _res: Response, next: NextFunction) => {
    next({ code: "501", message: "Not Implemented" });
  }
);

export { KnowledgeRouter };
