import { AuthCredential, connectDB } from "@/lib/database";
import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";


export async function POST(request: Request) {
  try {
    await connectDB();

    console.log("Login attempt received");

    // Parse request body
    let username, password;
    try {
      const body = await request.json();
      username = body.username;
      password = body.password;
    } catch (error) {
      console.error("Error parsing request body:", error);
      return NextResponse.json({ 
        status: false,
        message: "Invalid request body"
      }, { status: 400 });
    }

    // Validate required fields
    if (!username || !password) {
      console.log("Missing required fields");
      return NextResponse.json({
        status: false,
        message: "Email and password are required"
      }, { status: 400 });
    }

    console.log("Attempting to find user:", username);
    const authCredential = await AuthCredential.findOne({ username });

    if (!authCredential) {
      console.log("User not found:", username);
      return NextResponse.json({ 
        status: false,
        message: "User not found" 
      }, { status: 404 });
    }

    if (authCredential.password !== password) {
      console.log("Invalid password attempt for user:", username);
      return NextResponse.json({ 
        status: false,
        message: "Invalid password" 
      }, { status: 401 });
    }

    if (!process.env.JWT_SECRET) {
      console.error("JWT_SECRET environment variable not configured");
      return NextResponse.json({
        status: false,
        message: "Internal server error"
      }, { status: 500 });
    }

    console.log("Generating JWT token for user:", username);
    const token = jwt.sign(
      { userId: authCredential._id, username: authCredential.username, team_id: authCredential.team_id }, 
      process.env.JWT_SECRET
    );

    console.log("Login successful for user:", username);
    return NextResponse.json({ 
      status: true,
      message: "Login successful",
      token 
    }, { status: 200 });

  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json({
      status: false, 
      message: "An error occurred during login",
      error: String(error)
    }, { status: 500 });
  }
}