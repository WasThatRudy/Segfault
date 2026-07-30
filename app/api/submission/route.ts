import { NextResponse } from "next/server";
import { connectDB, Submission } from "@/lib/database";
import jwt from "jsonwebtoken";

export async function POST(request: Request) {  
    try {
        await connectDB();
        const data = await request.json();

        const submission = data.submission;

        const isValidHttpUrl = (value: unknown): boolean => {
            if (typeof value !== "string") return false;
            const trimmed = value.trim();
            try {
                const url = new URL(trimmed);
                return url.protocol === "http:" || url.protocol === "https:";
            } catch {
                return false;
            }
        };

        const isSingleKeyUrlObject = (obj: unknown): obj is Record<string, string> => {
            if (obj === null || typeof obj !== 'object' || Array.isArray(obj)) return false;
            const keys = Object.keys(obj as Record<string, unknown>);
            if (keys.length !== 1) return false;
            const url = (obj as Record<string, unknown>)[keys[0]];
            return isValidHttpUrl(typeof url === 'string' ? url.trim() : url);
        };

        const token = request.headers.get("Authorization")?.split(" ")[1];
        console.log("Token:", token);
        if (!token) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as jwt.JwtPayload;
        if (!decoded.team_id) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const teamId = decoded.team_id;

        // Validate: submission must be a non-empty array of single-key objects with http/https URL values
        if (!Array.isArray(submission) || submission.length === 0) {
            return NextResponse.json({ error: "submission must be a non-empty array of objects" }, { status: 400 });
        }

        const cleaned = submission.map((entry: unknown) => {
            if (entry === null || typeof entry !== 'object' || Array.isArray(entry)) return entry;
            const obj = entry as Record<string, unknown>;
            const keys = Object.keys(obj);
            if (keys.length !== 1) return entry;
            const key = keys[0];
            const value = obj[key];
            obj[key] = typeof value === 'string' ? value.trim() : value;
            return obj;
        });

        const allValid = cleaned.every(isSingleKeyUrlObject);
        if (!allValid) {
            return NextResponse.json({ error: "Each submission item must be an object with exactly one http/https URL" }, { status: 400 });
        }

        await Submission.findOneAndUpdate(
            { team_id: teamId },
            {
                $set: {
                    submission_document_url: cleaned,
                },
            },
            {
                upsert: true,
                new: true,
                setDefaultsOnInsert: true,
                runValidators: true,
            }
        );

        return NextResponse.json({ message: "Submission saved successfully" }, { status: 201 });

    } catch (error) {
        console.error("Error submitting submission:", error);
        return NextResponse.json({ error: "Failed to submit submission" }, { status: 500 });
    }
}