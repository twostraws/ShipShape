//
// ASCClient-Endpoints.swift
// ShipShape
// https://www.github.com/twostraws/ShipShape
// See LICENSE for license information.
//

import Foundation

extension ASCClient {
    /// Reads all the apps for a user.
    func fetchApps() async throws -> [ASCApp] {
        let url = "/apps"
        let response = try await fetch(url, as: ASCAppResponse.self)
        return response.data
    }

    /// Reads all the customer reviews for an app.
    func fetchReviews(for app: ASCApp) async throws -> [ASCCustomerReview] {
        let url = "/apps/\(app.id)/customerReviews"
        let response = try await fetch(url, as: ASCCustomerReviewResponse.self)
        return response.data
    }

    /// Reads all the public-facing App Store versions for an app.
    func fetchVersions(of app: ASCApp) async throws -> ASCAppVersionResponse {
        let url = "/apps/\(app.id)/appStoreVersions?include=appStoreVersionLocalizations,appStoreReviewDetail"
        let response = try await fetch(url, as: ASCAppVersionResponse.self)
        return response
    }
}
