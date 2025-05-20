//
// String-AppStoreState.swift
// ShipShape
// https://www.github.com/twostraws/ShipShape
// See LICENSE for license information.
//

import Foundation

extension String {
    /// Replaces Apple's App Store state hard-coded strings, e.g.
    /// `READY_FOR_SALE` becomes "READY FOR SALE".
    var convertFromAppStoreState: String {
        switch self {
        case "READY_FOR_SALE": "Ready for Sale"
        default: self
        }
    }
}
