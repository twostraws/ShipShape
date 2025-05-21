//
// Logger.swift
// ShipShape
// https://www.github.com/twostraws/ShipShape
// See LICENSE for license information.
//

import Foundation
import OSLog

@propertyWrapper
struct Logger {
    static var defaultSubsystem: String {
        Bundle.main.bundleIdentifier ?? "ShipShape"
    }

    let logger: os.Logger

    var wrappedValue: os.Logger {
        logger
    }

    init(subsystem: String = defaultSubsystem, category: String = #file) {
        logger = os.Logger(
            subsystem: subsystem,
            category: category
        )
    }
}
