import type { Request, Response, NextFunction } from "express";
import { aj } from "../config/arcjet.js";
import { slidingWindow, type ArcjetNodeRequest } from "@arcjet/node";

const securityMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  if (process.env.NODE_ENV === "test") return next();

  try {
    const role: RageLimitRole = req.user?.role ?? "guest";
    let limit: number;
    let message: string;

    switch (role) {
      case "admin":
        limit = 20;
        message =
          "admin  request limit exceeded (20 per minute) try again later.";
        break;
      case "teacher":
      case "student":
        limit = 10;
        message = "User request lmimt exceeded (10 per mminute) Please wait";
      default:
        limit = 5;
        message = "User request limit exceeded (5 per min)";
        break;
    }
    
    const client = aj.withRule(
      slidingWindow({
        mode: "LIVE",
        interval: "1m",
        max: limit,
      }),
    );

    const arjectRequest: ArcjetNodeRequest = {
      headers: req.headers,
      method: req.method,
      url: req.originalUrl ?? req.url,
      socket: {
        remoteAddress: req.socket.remoteAddress ?? req.ip ?? "0.0.0.0",
      },
    };

    const desicion = await client.protect(arjectRequest);

    if (desicion.isDenied() && desicion.reason.isBot()) {
      return res
        .status(403)
        .json({
          error: "Forbidden",
          message: "Automated requests are not allowed",
        });
    }
    if (desicion.isDenied() && desicion.reason.isShield()) {
      return res
        .status(403)
        .json({
          error: "Forbidden",
          message: "Requests blocked by security policy",
        });
    }
    if (desicion.isDenied() && desicion.reason.isRateLimit()) {
      return res.status(403).json({ error: "Forbidden", message });
    }
    
    next() // yes finally you can proceed
  } catch (error) {
    console.log("Security middleware failed", error);
    res.status(500).json({ error: error });
  }
};


export default securityMiddleware;