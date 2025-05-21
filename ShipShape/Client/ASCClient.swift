//
// ASCClient.swift
// ShipShape
// https://www.github.com/twostraws/ShipShape
// See LICENSE for license information.
//

import Foundation
import JWTKit

struct ASCLogEntry: Identifiable {
    var id = UUID()
    var url: String
    var response: String
    var date = Date.now
}

/// Handles all communication with App Store Connect.
@Observable @MainActor
class ASCClient {
    /// All the apps we loaded from the API
    var apps = [ASCApp]()

    /// The user's private ASC API key.
    var key: String

    /// The ID for their key; one ID per key.
    var keyID: String

    /// The Issuer ID; one ID per team.
    var issuerID: String

    /// The URLSession-compatible type to use for networking.
    var session: any URLSessionProtocol

    @ObservationIgnored
    @Logger private var logger

    var logEntries = [ASCLogEntry]()

    init(key: String, keyID: String, issuerID: String, session: any URLSessionProtocol = URLSession.shared) {
        self.key = key
        self.keyID = keyID
        self.issuerID = issuerID
        self.session = session
    }

    /// Fetches an App Store Connect API and decodes it to a specific type.
    func get<T: Decodable>(_ urlString: String, as type: T.Type) async throws -> T {
        guard let url = URL(string: "https://api.appstoreconnect.apple.com\(urlString)") else {
            fatalError("Malformed URL: \(urlString)")
        }

        let jwt = try await createJWT()

        var request = URLRequest(url: url)
        request.setValue("Bearer \(jwt)", forHTTPHeaderField: "authorization")
        let (result, _) = try await session.data(for: request, delegate: nil)

        // Log the JSON we get back, for inspection purposes.
        if let stringResult = String(data: result, encoding: .utf8) {
            logger.debug("\(stringResult)")

            let logEntry = ASCLogEntry(url: urlString, response: stringResult)
            logEntries.insert(logEntry, at: 0)
        }

        let decoder = JSONDecoder()
        decoder.dateDecodingStrategy = .iso8601

        do {
            return try decoder.decode(T.self, from: result)
        } catch DecodingError.keyNotFound(let key, let context) {
            fatalError("Failed to decode due to missing key '\(key)' - \(context.debugDescription)")
        } catch DecodingError.typeMismatch(_, let context) {
            fatalError("Failed to decode due to type mismatch - \(context.debugDescription)")
        } catch DecodingError.valueNotFound(let type, let context) {
            fatalError("Failed to decode due to missing \(type) value - \(context.debugDescription)")
        } catch DecodingError.dataCorrupted(let context) {
            fatalError("Failed to decode: it appears to be invalid JSON: \(context)")
        } catch {
            fatalError("Failed to decode: \(error.localizedDescription)")
        }
    }

    func post<T: Encodable>(_ urlString: String, attaching content: T) async throws -> Bool {
        guard let url = URL(string: "https://api.appstoreconnect.apple.com\(urlString)") else {
            fatalError("Malformed URL: \(urlString)")
        }

        let jwt = try await createJWT()

        var request = URLRequest(url: url)
        request.httpMethod = "POST"
        request.httpBody = try JSONEncoder().encode(content)
        request.setValue("Bearer \(jwt)", forHTTPHeaderField: "authorization")
        request.setValue("application/json", forHTTPHeaderField: "Content-Type")

        let data = try JSONEncoder().encode(content)
        print(String(decoding: data, as: UTF8.self))

        let (_, response) = try await session.data(for: request, delegate: nil)

        if let response = response as? HTTPURLResponse {
            switch response.statusCode {
            case 201:
                // all good
                return true
            case 400:
                logger.error("Bad request: \(url)")
            case 401:
                logger.error("Unauthorized post: \(url)")
            case 403:
                logger.error("Forbidden post: \(url)")
            case 409:
                logger.error("Post conflict: \(url)")
            case 422:
                logger.error("Post error: \(url)")
            default:
                logger.error("Unknown post response: \(url)")
            }
        }

        return false
    }

    func delete(_ urlString: String) async throws {
        guard let url = URL(string: "https://api.appstoreconnect.apple.com\(urlString)") else {
            fatalError("Malformed URL: \(urlString)")
        }

        let jwt = try await createJWT()

        var request = URLRequest(url: url)
        request.httpMethod = "DELETE"
        request.setValue("Bearer \(jwt)", forHTTPHeaderField: "authorization")
        let (_, response) = try await session.data(for: request, delegate: nil)

        if let response = response as? HTTPURLResponse {
            switch response.statusCode {
            case 204:
                // all good
                break
            case 401:
                logger.error("Unauthorized delete: \(url)")
            case 403:
                logger.error("Forbidden delete: \(url)")
            case 404:
                logger.error("Object to delete was not found: \(url)")
            case 409:
                logger.error("Delete conflict: \(url)")
            default:
                logger.error("Unknown delete response: \(url)")
            }
        }
    }

    /// Creates a valid JSON Web Token for ASC.
    private func createJWT() async throws -> String {
        let key = try ES256PrivateKey(pem: key)
        let keyID = JWKIdentifier(string: keyID)

        let keyCollection = JWTKeyCollection()
        await keyCollection.add(ecdsa: key, kid: keyID)

        let payload = ASCPayload(
            iss: IssuerClaim(value: issuerID),
            iat: IssuedAtClaim(value: .now),
            exp: ExpirationClaim(value: .now.addingTimeInterval(600)),
            aud: AudienceClaim(value: ["appstoreconnect-v1"])
        )

        return try await keyCollection.sign(payload, kid: keyID)
    }
}
