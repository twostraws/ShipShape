//
// String-InAppPurchaseType.swift
// ShipShape
// https://www.github.com/twostraws/ShipShape
// See LICENSE for license information.
//

import Foundation

extension String {
    /// Replaces Apple's App Store state hard-coded strings, e.g.
    /// `APPROVED` becomes "Approved".
    var convertFromInAppPurchaseType: String {
        switch self {
        case "CONSUMABLE": "Consumable"
        case "NON_CONSUMABLE": "Non-consumable"
        case "NON_RENEWING_SUBSCRIPTION": "Non-renewing Subscription"
        default: self
        }
    }
}
