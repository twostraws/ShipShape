//
// LocalePickerView.swift
// ShipShape
// https://www.github.com/twostraws/ShipShape
// See LICENSE for license information.
//

import SwiftUI

struct LocalePickerView: View {
    @Binding var selectedLocale: String
    @State private var selectedIndex: Int = 0

    let availableLocales: [String]

    var body: some View {
        HStack {
            Picker("Locale", selection: $selectedLocale) {
                ForEach(availableLocales, id: \.self) { locale in
                    Text(Locale.current.localizedString(forIdentifier: locale) ?? locale).tag(locale)
                }
            }
            .pickerStyle(.menu)

#if os(macOS)
            Button("◀") {
                if selectedIndex > 0 {
                    selectedIndex -= 1
                    selectedLocale = availableLocales[selectedIndex]
                }
            }
            .disabled(selectedIndex == 0)

            Button("▶") {
                if selectedIndex < availableLocales.count - 1 {
                    selectedIndex += 1
                    selectedLocale = availableLocales[selectedIndex]
                }
            }
            .disabled(selectedIndex == availableLocales.count - 1)
#endif
        }
        .onChange(of: selectedLocale) { _, newValue in
            if let newIndex = availableLocales.firstIndex(of: newValue) {
                selectedIndex = newIndex
            }
        }
    }
}
