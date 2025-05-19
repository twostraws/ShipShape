//
// ASCClient.swift
// ShipShape
// https://www.github.com/twostraws/ShipShape
// See LICENSE for license information.
//

import Foundation
import JWTKit

/// Handles all communication with App Store Connect.
struct ASCClient {
    /// The user's private ASC API key.
    var key: String

    /// The ID for their key; one ID per key.
    var keyID: String

    /// The Issuer ID; one ID per team.
    var issuerID: String

    /// Fetches an App Store Connect API and decodes it to a specific type.
    func fetch<T: Decodable>(_ urlString: String, as type: T.Type) async throws -> T {
        guard let url = URL(string: "https://api.appstoreconnect.apple.com/v1\(urlString)") else {
            fatalError("Malformed URL: \(urlString)")
        }

        let jwt = try await createJWT()

        var request = URLRequest(url: url)
        request.setValue("Bearer \(jwt)", forHTTPHeaderField: "authorization")
        let (result, _) = try await URLSession.shared.data(for: request)

        // Print the JSON we get back, for inspection purposes.
        if let stringResult = String(data: result, encoding: .utf8) {
            print(stringResult)
        }

        let decoder = JSONDecoder()
        decoder.dateDecodingStrategy = .iso8601
        return try decoder.decode(T.self, from: result)
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
