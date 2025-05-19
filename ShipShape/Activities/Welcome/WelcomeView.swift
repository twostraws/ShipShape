//
// WelcomeView.swift
// ShipShape
// https://www.github.com/twostraws/ShipShape
// See LICENSE for license information.
//

import SwiftUI

/// Handles all first-run input and validation.
struct WelcomeView: View {
    @Environment(UserSettings.self) var userSettings

    @State private var isFileBeingDropped = false
    @State private var isShowingError = false
    @State private var errorMessage = ""

    @State private var key = ""
    @State private var keyID = ""
    @State private var keyIssuerID = ""

    var isMissingUserData: Bool {
        key.isEmpty || keyID.isEmpty || keyIssuerID.isEmpty
    }

    var body: some View {
        ScrollView {
            Text("Welcome to ShipShape!")
                .font(.largeTitle)

            if key.isEmpty {
                Text("ShipShape is a free, open-source app to manage your apps using Apple's App Store Connect API.")
                    .multilineTextAlignment(.center)
                    .font(.title3)
                    .padding(.bottom, 20)

                Text("""
                To get started, you need to create an API key. \
                [Click here to open App Store Connect](https://appstoreconnect.apple.com) in your web browser.

                Go to **Users and Access** then **Integrations** to make your key. \
                We suggest selecting Admin for access options.

                When you're done, download the key and drag it here. \
                **Note:** You can download this key only once, so store it in a safe place.
                """)
            } else {
                Text("To complete setup, please Key ID and Issuer ID fields below:")

                Form {
                    TextField("Key ID:", text: $keyID)
                    TextField("Issuer ID:", text: $keyIssuerID)

                    Button("Continue", action: saveCredentials)
                        .disabled(isMissingUserData)
                }
            }
        }
        .padding(10)
        .frame(maxWidth: .infinity, maxHeight: .infinity)
        .scrollBounceBehavior(.basedOnSize)
        .clipShape(.rect(cornerRadius: 20))
        .overlay {
            if isFileBeingDropped {
                RoundedRectangle(cornerRadius: 20)
                    .strokeBorder(.blue, style: .init(lineWidth: 2, lineCap: .round, lineJoin: .round, dash: [8, 8]))
            }
        }
        .padding()
        .dropDestination(for: Data.self, action: handleDataDrop) {
            isFileBeingDropped = $0
        }
        .dropDestination(for: URL.self, action: handleURLDrop) {
            isFileBeingDropped = $0
        }
        .alert("", isPresented: $isShowingError) {
            Button("OK") { }
        } message: {
            Text(errorMessage)
        }
    }

    /// iOS: Handles users dropping their p8 key for App Store Connect.
    func handleDataDrop(items: [Data], point: CGPoint) -> Bool {
        guard let data = items.first else { return false }

        let contents = String(decoding: data, as: UTF8.self)
        return loadKey(contents)
    }

    /// macOS: Handles users dropping their p8 key for App Store Connect.
    func handleURLDrop(items: [URL], point: CGPoint) -> Bool {
        guard let url = items.first else { return false }

        do {
            let contents = try String(contentsOf: url)
            return loadKey(contents, from: url)
        } catch {
            errorMessage = "There was a problem reading the key file."
            isShowingError = true
            print(error.localizedDescription)
            return false
        }
    }

    func loadKey(_ contents: String, from url: URL? = nil) -> Bool {
        if validate(keyString: contents) {
            assign(keyString: contents, from: url)
            return true
        } else {
            errorMessage = "The file you dropped does not appear to be a valid App Store Connect API key."
            isShowingError = true
            return false
        }
    }

    /// Checks the dropped file contains basic key markers.
    func validate(keyString: String) -> Bool {
        keyString.contains("BEGIN PRIVATE KEY") && keyString.contains("END PRIVATE KEY")
    }

    /// Stashes the key away, and also attempts to read the key ID.
    func assign(keyString: String, from url: URL?) {
        key = keyString

        // If we weren't given a URL to the key, exit now.
        guard let url else { return }

        // Key filenames have the format AuthKey_???.p8, and
        // that ??? part should be the key ID.
        let filename = url.deletingPathExtension().lastPathComponent
        let filenameParts = filename.split(separator: "_")

        // Exit if we couldn't read a key ID.
        guard filenameParts.count == 2 else { return }

        // If we're still here, we have a probable key ID.
        keyID = String(filenameParts[1])
    }

    /// Copies the user's credentials to the keychain and finishes first run.
    func saveCredentials() {
        // Last check to make sure we have meaningful data here.
        guard key.isEmpty == false else { return }
        guard keyID.isEmpty == false else { return }
        guard keyIssuerID.isEmpty == false else { return }

        userSettings.setAPIKey(key)
        userSettings.setAPIKeyID(keyID)
        userSettings.setAPIKeyIssuer(keyIssuerID)
    }
}

#Preview {
    WelcomeView()
        .environment(UserSettings())
}
