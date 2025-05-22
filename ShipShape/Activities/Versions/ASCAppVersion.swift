//
// ASCAppVersion.swift
// ShipShape
// https://www.github.com/twostraws/ShipShape
// See LICENSE for license information.
//

import Foundation

/// One ASC app can have multiple versions, e.g. v1 for iOS, v2 for macOS.
struct ASCAppVersion: Comparable, Decodable, Hashable, Identifiable {
    var id: String
    var attributes: Attributes

    static func < (lhs: ASCAppVersion, rhs: ASCAppVersion) -> Bool {
        let left = lhs.attributes.versionString ?? ""
        let right = rhs.attributes.versionString ?? ""
        return left.isVersioned(before: right)
    }

    struct Attributes: Decodable, Hashable {
        var platform: String
        var versionString: String?
        var appStoreState: String?
        var appVersionState: String?
        var copyright: String?
        var releaseType: String
        var createdDate: Date
    }

    // MARK: Example
    static var example: ASCAppVersion {
        ASCAppVersion(
            id: "123",
            attributes: Attributes(
                platform: "MAC_OS",
                versionString: "1.0.0",
                appStoreState: "READY_FOR_SALE",
                copyright: "@ExampleCopyright",
                releaseType: "MANUAL",
                createdDate: Date.now
            )
        )
    }

    static var example2: ASCAppVersion {
        ASCAppVersion(
            id: "123",
            attributes: Attributes(
                platform: "IOS",
                versionString: "1.0.0",
                appStoreState: "PREPARE_FOR_SUBMISSION",
                copyright: "@ExampleCopyright",
                releaseType: "MANUAL",
                createdDate: Date.now
            )
        )
    }
}

struct ASCAppVersionResponse: Decodable {
    var data: [ASCAppVersion]

    var appStoreVersionLocalizations = [ASCVersionLocalization]()
    var appStoreReviewDetails = [ASCReviewDetails]()

    enum CodingKeys: CodingKey {
        case data, included
    }

    init(from decoder: any Decoder) throws {
        let container = try decoder.container(keyedBy: CodingKeys.self)
        self.data = try container.decode([ASCAppVersion].self, forKey: .data)

        if let includedData = try container.decodeIfPresent([ASCIncludedData].self, forKey: .included) {
            for item in includedData {
                switch item {
                case .versionLocalization(let value):
                    appStoreVersionLocalizations.append(value)

                case .reviewDetails(let value):
                    appStoreReviewDetails.append(value)

                default:
                    // Ignore all other types of included data.
                    break
                }
            }
        }
    }
}
