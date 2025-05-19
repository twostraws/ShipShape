//
// UserSettings.swift
// ShipShape
// https://www.github.com/twostraws/ShipShape
// See LICENSE for license information.
//

import Foundation

/// Stores all settings regarding the current user.
@Observable @MainActor
class UserSettings {
    private let apiKeyName = "APIKey"
    private let apiKeyIDName = "APIKeyID"
    private let apiKeyIssuerName = "APIKeyIssuer"

    private(set) var apiKey: String?
    private(set) var apiKeyID: String?
    private(set) var apiKeyIssuer: String?

    init() {
        apiKey = readFromKeychain(apiKeyName)
        apiKeyID = readFromKeychain(apiKeyIDName)
        apiKeyIssuer = readFromKeychain(apiKeyIssuerName)
    }

    func setAPIKey(_ apiKey: String) {
        self.apiKey = apiKey

        if let data = apiKey.data(using: .utf8) {
            writeToKeychain(key: apiKeyName, value: data)
        }
    }

    func setAPIKeyID(_ apiKeyID: String) {
        self.apiKeyID = apiKeyID

        if let data = apiKeyID.data(using: .utf8) {
            writeToKeychain(key: apiKeyIDName, value: data)
        }
    }

    func setAPIKeyIssuer(_ apiKeyIssuer: String) {
        self.apiKeyIssuer = apiKeyIssuer

        if let data = apiKeyIssuer.data(using: .utf8) {
            writeToKeychain(key: apiKeyIssuerName, value: data)
        }
    }

    func clearCredentials() {
        deleteFromKeychain(apiKeyName)
        deleteFromKeychain(apiKeyIDName)
        deleteFromKeychain(apiKeyIssuerName)

        apiKey = nil
        apiKeyID = nil
        apiKeyIssuer = nil
    }

    private func writeToKeychain(key: String, value: Data) {
        let query: [String: Any] = [
            kSecClass as String: kSecClassGenericPassword,
            kSecAttrAccount as String: key,
            kSecValueData as String: value,
            kSecAttrSynchronizable as String: kCFBooleanTrue!
        ]

        SecItemDelete(query as CFDictionary)

        let status = SecItemAdd(query as CFDictionary, nil)

        if status == errSecSuccess {
            print("Keychain item added successfully.")
        } else if status == errSecDuplicateItem {
            print("Item already exists.")
        } else {
            print("Keychain error: \(status)")
        }
    }

    private func readFromKeychain(_ key: String) -> String? {
        let query: [String: Any] = [
            kSecClass as String: kSecClassGenericPassword,
            kSecAttrAccount as String: key,
            kSecReturnData as String: kCFBooleanTrue!,
            kSecMatchLimit as String: kSecMatchLimitOne,
            kSecAttrSynchronizable as String: kSecAttrSynchronizableAny
        ]

        var dataTypeRef: AnyObject?

        if SecItemCopyMatching(query as CFDictionary, &dataTypeRef) == noErr {
            if let data = dataTypeRef as? Data {
                if let value = String(data: data, encoding: .utf8) {
                    return value
                }
            }
        }

        return nil
    }

    private func deleteFromKeychain(_ key: String) {
        let query: [String: Any] = [
            kSecClass as String: kSecClassGenericPassword,
            kSecAttrAccount as String: key,
            kSecAttrSynchronizable as String: kSecAttrSynchronizableAny
        ]

        SecItemDelete(query as CFDictionary)
    }
}
