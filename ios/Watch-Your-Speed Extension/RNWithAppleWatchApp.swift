//
//  RNWithAppleWatchApp.swift
//  Watch-Your-Speed Extension
//
//  Created by Sam Morgan-tyghe on 16/03/2021.
//

import SwiftUI

@main
struct RNWithAppleWatchApp: App {
    @SceneBuilder var body: some Scene {
        WindowGroup {
            NavigationView {
                ContentView()
            }
        }

        WKNotificationScene(controller: NotificationController.self, category: "myCategory")
    }
}
