import SwiftUI

@main
struct SampleApp: App {
    var body: some Scene {
        WindowGroup {
            ContentView()
        }
    }
}

struct ContentView: View {
    @State private var email: String = ""
    @State private var password: String = ""
    @State private var isLoggedIn: Bool = false
    @State private var message: String = ""
    
    var body: some View {
        NavigationView {
            if isLoggedIn {
                DashboardView()
            } else {
                LoginView(
                    email: $email,
                    password: $password,
                    isLoggedIn: $isLoggedIn,
                    message: $message
                )
            }
        }
    }
}

struct LoginView: View {
    @Binding var email: String
    @Binding var password: String
    @Binding var isLoggedIn: Bool
    @Binding var message: String
    
    var body: some View {
        VStack(spacing: 20) {
            Text("Welcome")
                .font(.largeTitle)
                .padding()
            
            TextField("Email", text: $email)
                .textFieldStyle(RoundedBorderTextFieldStyle())
                .padding()
                .accessibilityIdentifier("Email")
            
            SecureField("Password", text: $password)
                .textFieldStyle(RoundedBorderTextFieldStyle())
                .padding()
                .accessibilityIdentifier("Password")
            
            Button(action: {
                if email == "test@example.com" && password == "password123" {
                    isLoggedIn = true
                    message = "Login successful!"
                } else {
                    message = "Invalid credentials"
                }
            }) {
                Text("Login")
                    .frame(maxWidth: .infinity)
                    .padding()
                    .background(Color.blue)
                    .foregroundColor(.white)
                    .cornerRadius(10)
            }
            .accessibilityIdentifier("Login")
            .padding()
            
            if !message.isEmpty {
                Text(message)
                    .foregroundColor(message.contains("successful") ? .green : .red)
                    .accessibilityIdentifier("Message")
            }
        }
        .padding()
    }
}

struct DashboardView: View {
    var body: some View {
        VStack(spacing: 20) {
            Text("Dashboard")
                .font(.largeTitle)
                .accessibilityIdentifier("Dashboard")
            
            Text("Welcome! You are logged in.")
                .font(.headline)
                .accessibilityIdentifier("Welcome")
            
            Button(action: {}) {
                Text("Logout")
                    .frame(maxWidth: .infinity)
                    .padding()
                    .background(Color.red)
                    .foregroundColor(.white)
                    .cornerRadius(10)
            }
            .accessibilityIdentifier("Logout")
            .padding()
        }
        .padding()
    }
}

