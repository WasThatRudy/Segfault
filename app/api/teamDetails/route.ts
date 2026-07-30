import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { Submission, TeamRegistration, connectDB } from "@/lib/database";

export async function GET(request: Request) {
    try {
        // Connect to database
        await connectDB();

        // Get token from Authorization header
        const authHeader = request.headers.get("Authorization");
        if (!authHeader?.startsWith("Bearer ")) {
            return NextResponse.json({ 
                status: false,
                message: "Invalid authorization header format" 
            }, { status: 401 });
        }

        const token = authHeader.split(" ")[1];
        if (!token) {
            return NextResponse.json({ 
                status: false,
                message: "No token provided" 
            }, { status: 401 });
        }

        // Verify JWT secret exists
        if (!process.env.JWT_SECRET) {
            console.error("JWT_SECRET environment variable not configured");
            return NextResponse.json({
                status: false,
                message: "Internal server error"
            }, { status: 500 });
        }

        // Verify and decode token
        let decoded;
        try {
            decoded = jwt.verify(token, process.env.JWT_SECRET) as {
                team_id: string;
                username: string;
                _id: string;
            };
        } catch (error) {
            console.error("Token verification failed:", error);
            return NextResponse.json({
                status: false,
                message: "Invalid or expired token"
            }, { status: 401 });
        }

        if (!decoded.team_id) {
            return NextResponse.json({
                status: false,
                message: "Invalid token payload"
            }, { status: 401 });
        }

        // Find team details
        try {
            const team = await TeamRegistration.findById(decoded.team_id).select('-idea_document_url -selected');
            const submission = await Submission.findOne({ team_id: decoded.team_id });
            if (!team) {
                return NextResponse.json({
                    status: false,
                    message: "Team not found"
                }, { status: 404 });
            }

            return NextResponse.json({
                status: true,
                message: "Team details fetched successfully",
                team,
                submission
            });

        } catch (error) {
            console.error("Database query error:", error);
            return NextResponse.json({
                status: false,
                message: "Error fetching team details",
                error: String(error)
            }, { status: 500 });
        }

    } catch (error) {
        console.error("Unexpected error:", error);
        return NextResponse.json({
            status: false,
            message: "An unexpected error occurred",
            error: String(error)
        }, { status: 500 });
    }
}