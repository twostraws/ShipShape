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
        case "ACCEPTED": "Accepted"
        case "DEVELOPER_REMOVED_FROM_SALE": "Developer Removed from Sale"
        case "DEVELOPER_REJECTED": "Developer Rejected"
        case "IN_REVIEW": "In Review"
        case "INVALID_BINARY": "Invalid Binary"
        case "METADATA_REJECTED": "Metadata Rejected"
        case "PENDING_APPLE_RELEASE": "Pending Apple Release"
        case "PENDING_CONTRACT": "Pending Contract"
        case "PENDING_DEVELOPER_RELEASE": "Pending Developer Release"
        case "PREPARE_FOR_SUBMISSION": "Prepare for Submission"
        case "PREORDER_READY_FOR_SALE": "Preorder Ready for Sale"
        case "PROCESSING_FOR_APP_STORE": "Processing for AppStore"
        case "READY_FOR_REVIEW": "Ready for Review"
        case "READY_FOR_SALE": "Ready for Sale"
        case "REJECTED": "Rejected"
        case "REMOVED_FROM_SALE": "Removed from Sale"
        case "WAITING_FOR_EXPORT_COMPLIANCE": "Waiting for Export Compliance"
        case "WAITING_FOR_REVIEW": "Waiting for Review"
        case "REPLACED_WITH_NEW_VERSION": "Replaced with New Version"
        case "NOT_APPLICABLE": "Not Applicable"
        default: self
        }
    }
}
