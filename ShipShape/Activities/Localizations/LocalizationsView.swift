//
// LocalizationsView.swift
// ShipShape
// https://www.github.com/twostraws/ShipShape
// See LICENSE for license information.
//

import SwiftUI

/// Displays data about a single `ASCVersionLocalization`.
struct LocalizationsView: View {
    @Environment(ASCClient.self) var client
    @State private var loadState = LoadState.loading
    @State private var availableLocales: [String] = []
    @State private var selectedLocale: String = ""
    @Logger private var logger

    var app: ASCApp

    var body: some View {
        LoadingView(loadState: $loadState, retryAction: load) {
            Form {
                    Picker("Locale", selection: $selectedLocale) {
                        ForEach(availableLocales, id: \.self) { locale in
                            Text(Locale.current.localizedString(forIdentifier: locale) ?? locale).tag(locale)
                        }
                    }
                    .pickerStyle(.menu)

                if let localization = app.localizations.first(where: { locale in
                    locale.attributes.locale == selectedLocale
                }) {
                    Section("Description") {
                        Text(localization.attributes.description ?? DefaultValues.notSet)
                            .textSelection(.enabled)
                    }

                    Section("Keywords") {
                        Text(localization.attributes.keywords?.replacing(",", with: ", ") ?? DefaultValues.notSet)
                            .textSelection(.enabled)
                    }

                    // LabeledContent("Locale", value: localization.attributes.locale ?? DefaultValues.unknown)
                } else {
                    Text("No localizations.")
                }
            }
            .formStyle(.grouped)
        }
        .task(load)
        .toolbar {
            ReloadButton(action: load)
        }
    }

    @MainActor
    func load() async {
        do {
            loadState = .loading
            try await client.fetchVersions(of: app)

            let locales = Set(app.localizations.compactMap { $0.attributes.locale })
            availableLocales = Array(locales).sorted()

            DispatchQueue.main.async {
                if selectedLocale.isEmpty {
                    selectedLocale = app.attributes.primaryLocale
                }
            }

            loadState = .loaded
        } catch {
            logger.error("\(error.localizedDescription)")
            loadState = .failed
        }
    }
}

#Preview {
    LocalizationsView(app: ASCApp.example)
}
