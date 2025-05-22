//
// ASCPerformanceMetrics.swift
// ShipShape
// https://www.github.com/twostraws/ShipShape
// See LICENSE for license information.
//

import Foundation

struct ASCPerformanceMetrics: Decodable, Hashable, Identifiable {
    var id: String { platform }
    var platform: String
    var metricCategories: [ASCPerformanceMetricCategory]
}

struct ASCPerformanceMetricCategory: Decodable, Hashable {
    var identifier: String
    var metrics: [ASCPerformanceMetric]
}

struct ASCPerformanceMetric: Decodable, Hashable {
    var identifier: String
    var unit: ASCPerformanceMetricUnit
    var datasets: [ASCPerformanceMetricDataSet]
}

struct ASCPerformanceMetricUnit: Decodable, Hashable {
    var identifier: String
    var displayName: String
}

struct ASCPerformanceMetricDataSet: Decodable, Hashable {
    var filterCriteria: ASCPerformanceMetricFilterCriteria
    var points: [ASCPerformanceMetricDataPoint]
}

struct ASCPerformanceMetricFilterCriteria: Decodable, Hashable {
    var percentile: String
    var device: String
    var deviceMarketingName: String
}

struct ASCPerformanceMetricDataPoint: Decodable, Hashable {
    var version: String
    var value: Double
    var errorMargin: Double?
    var percentageBreakdown: [ASCPerformanceMetricDataPointBreakdown]?
}

struct ASCPerformanceMetricDataPointBreakdown: Decodable, Hashable {
    var value: Int
    var subSystemLabel: String
}

struct ASCPerformanceMetricsResponse: Decodable, Hashable {
    var productData: [ASCPerformanceMetrics]
}
