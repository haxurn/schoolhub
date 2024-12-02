import { LoginCredentials, LoginResponse } from "@/types/auth";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

export async function loginAdmin(credentials: LoginCredentials): Promise<LoginResponse> {
  try {
    const response = await fetch(`${API_URL}/api/auth/admin`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(credentials),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.log("Login failed response:", errorData); // Log the response
      throw new Error(errorData.message || "Invalid username or password");
    }

    const data: LoginResponse = await response.json();

    // Ensure the token is present and return the data
    if (data.token) {
      localStorage.setItem("auth_token", data.token);
      console.log("Login successful:", data.message);
      return data;
    } else {
      throw new Error("Login failed: Token not provided");
    }
  } catch (error) {
    console.error("Error during login:", error);

    if (error instanceof Error) {
      throw new Error(error.message);
    }

    throw new Error("An unexpected error occurred");
  }
}
