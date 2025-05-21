//
// ASCClient-Endpoints.swift
// ShipShape
// https://www.github.com/twostraws/ShipShape
// See LICENSE for license information.
//

import Foundation

extension ASCClient {
    /// Reads all the apps for a user.
    func getApps() async throws {
        let url = "/v1/apps?limit=200"
        let response = try await get(url, as: ASCAppResponse.self)
        apps = response.data.sorted()
    }

    /// Reads all the customer reviews for an app.
    func getReviews(of app: ASCApp) async throws {
        guard let index = apps.firstIndex(of: app) else { return }

        let url = "/v1/apps/\(app.id)/customerReviews"
        let response = try await get(url, as: ASCCustomerReviewResponse.self)
        apps[index].customerReviews = response.data
    }

    /// Reads all the public-facing App Store versions for an app.
    func getVersions(of app: ASCApp) async throws {
        guard let index = apps.firstIndex(of: app) else { return }

        let url = "/v1/apps/\(app.id)/appStoreVersions?include=appStoreVersionLocalizations,appStoreReviewDetail"
        let response = try await get(url, as: ASCAppVersionResponse.self)
        apps[index].versions = response.data.sorted().reversed()
        apps[index].localizations = response.appStoreVersionLocalizations
        apps[index].reviewDetails = response.appStoreReviewDetails
    }

    /// Reads all the builds submitted for an app.
    func getBuilds(of app: ASCApp) async throws {
        guard let index = apps.firstIndex(of: app) else { return }

        let url = "/v1/apps/\(app.id)/builds"

        let response = try await get(url, as: ASCAppBuildResponse.self)
        apps[index].builds = response.data
    }

    /// Reads all the screenshot sets submitted for an app localization.
    func getScreenshotSets(of version: ASCVersionLocalization, for app: ASCApp) async throws {
        guard let appIndex = apps.firstIndex(of: app) else { return }
        guard let versionIndex = apps[appIndex].localizations.firstIndex(of: version) else { return }

        let url = "/v1/appStoreVersionLocalizations/\(version.id)/appScreenshotSets"
        let response = try await get(url, as: ASCAppScreenshotSetResponse.self)

        var screenshotSets = response.data

        for (index, screenshotSet) in screenshotSets.enumerated() {
            let url = "/v1/appScreenshotSets/\(screenshotSet.id)/appScreenshots"
            let response = try await get(url, as: ASCAppScreenshotResponse.self)
            screenshotSets[index].screenshots.append(contentsOf: response.data)
        }

        apps[appIndex].localizations[versionIndex].screenshotSets = screenshotSets
    }

    /// Reads all in-app purchases for an app.
    func getInAppPurchases(of app: ASCApp) async throws {
        guard let appIndex = apps.firstIndex(of: app) else { return }

        let url = "/v1/apps/\(app.id)/inAppPurchasesV2"
        let response = try await get(url, as: ASCInAppPurchaseResponse.self)

        apps[appIndex].inAppPurchases = response.data
    }

    /// Reads all subscriptions for an app.
    func getSubscriptions(of app: ASCApp) async throws {
        guard let appIndex = apps.firstIndex(of: app) else { return }

        let url = """
        /v1/apps/\(app.id)/subscriptionGroups?include=subscriptions,subscriptionGroupLocalizations\
        &fields[subscriptions]=name,productId,familySharable,state,subscriptionPeriod,reviewNote
        """
        let response = try await get(url, as: ASCSubscriptionGroupResponse.self)
        var subscriptionGroups = response.data

        for index in response.data.indices {
            subscriptionGroups[index].subscriptions = response.subscriptions
            subscriptionGroups[index].subscriptionGroupLocalizations = response.subscriptionGroupLocalizations
        }

        apps[appIndex].subscriptionGroups = subscriptionGroups
    }

    /// Reads power and performance and metrics for an app.
    func getPerformanceMetricsData(of app: ASCApp) async throws {
        guard let appIndex = apps.firstIndex(of: app) else { return }

        let url = "/v1/apps/\(app.id)/perfPowerMetrics"
        let response = try await get(url, as: ASCPerformanceMetricsResponse.self)
        apps[appIndex].performanceMetrics = response.productData
    }

    /// Reads all territory availability for an app.
    func getAvailability(of app: ASCApp) async throws {
        guard let appIndex = apps.firstIndex(of: app) else { return }

        let url = "/v2/appAvailabilities/\(app.id)/territoryAvailabilities?include=territory&limit=200"

        let response = try await get(url, as: ASCAppAvailabilityResponse.self)
        apps[appIndex].availability = response.data.sorted()
    }

    /// Reads all promotion nominations for an app.
    func getNominations(of app: ASCApp) async throws {
        guard let appIndex = apps.firstIndex(of: app) else { return }

        let url = "/v1/nominations?filter[state]=SUBMITTED&filter[relatedApps]=\(app.id)"

        let response = try await get(url, as: ASCAppNominationResponse.self)
        apps[appIndex].nominations = response.data
    }
}
