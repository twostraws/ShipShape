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

    /// Reads all the builds submitted for an app.
    func fetchBuilds(of app: ASCApp) async throws -> [ASCAppBuild] {
        let url = "/apps/\(app.id)/builds"
        let response = try await fetch(url, as: ASCAppBuildResponse.self)
        return response.data
    }

    /// Reads all the screenshot sets submitted for an app localization.
    func fetchScreenshotSets(of version: ASCVersionLocalization) async throws -> [ASCAppScreenshotSet] {
        let url = "/appStoreVersionLocalizations/\(version.id)/appScreenshotSets"
        let response = try await fetch(url, as: ASCAppScreenshotSetResponse.self)

        var screenshotSets = response.data

        for (index, screenshotSet) in screenshotSets.enumerated() {
            let url = "/appScreenshotSets/\(screenshotSet.id)/appScreenshots"
            let response = try await fetch(url, as: ASCAppScreenshotResponse.self)
            screenshotSets[index].screenshots.append(contentsOf: response.data)
        }

        return screenshotSets
    }
}
