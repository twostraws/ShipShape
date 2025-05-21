//
// String-VersionCompare.swift
// ShipShape
// https://www.github.com/twostraws/ShipShape
// See LICENSE for license information.
//

import Foundation

extension String {
    func isVersioned(before other: String) -> Bool {
        var version1 = self.split(separator: ".").map { Int($0) ?? 0 }
        var version2 = other.split(separator: ".").map { Int($0) ?? 0 }

        version1 += repeatElement(0, count: max(0, version2.count - version1.count))
        version2 += repeatElement(0, count: max(0, version1.count - version2.count))

        for (num1, num2) in zip(version1, version2) {
            if num1 > num2 {
                return false
            } else {
                return true
            }
        }

        return false
    }
}
