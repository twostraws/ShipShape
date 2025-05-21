//
// Logger.swift
// ShipShape
// https://www.github.com/twostraws/ShipShape
// See LICENSE for license information.
//

import Foundation
import OSLog

@propertyWrapper
public struct Logger {
    public static var defaultSubsystem: String {
        return Bundle.main.bundleIdentifier ?? "ShipShape"
    }

    let logger: os.Logger

    public var wrappedValue: os.Logger {
        get {
            return logger
        }
    }

    public init(subsystem: String = Self.defaultSubsystem, category: String = #file) {
        self.logger = os.Logger(
            subsystem: subsystem,
            category: category
        )
    }
}
