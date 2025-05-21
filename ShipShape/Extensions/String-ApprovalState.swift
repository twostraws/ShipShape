//
// String-ApprovalState.swift
// ShipShape
// https://www.github.com/twostraws/ShipShape
// See LICENSE for license information.
//

import Foundation

extension String {
    /// Replaces Apple's App Store state hard-coded strings, e.g.
    /// `APPROVED` becomes "Approved".
    var convertFromApprovalState: String {
        switch self {
        case "MISSING_METADATA": "Missing Metadata"
        case "READY_TO_SUBMIT": "Ready to Submit"
        case "WAITING_FOR_REVIEW": "Waiting for Review"
        case "IN_REVIEW": "In Review"
        case "DEVELOPER_ACTION_NEEDED": "Developer Action Needed ⚠️"
        case "PENDING_BINARY_APPROVAL": "Pending Binary Approval"
        case "APPROVED": "Approved 🟢"
        case "DEVELOPER_REMOVED_FROM_SALE": "Developer Removed from Sale"
        case "REMOVED_FROM_SALE": "Removed from Sale"
        case "REJECTED": "Rejected 🔴"
        default: self
        }
    }
}
