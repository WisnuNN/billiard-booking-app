<?php

namespace App\Http\Controllers;

use OpenApi\Attributes as OA;

#[OA\Info(
    version: "1.0.0",
    description: "Welcome to the official **Booking Billiard API** documentation.\n\nThis API provides an enterprise-grade backend infrastructure designed to streamline and automate billiard center operations. Built with a focus on high performance, security, and scalability, it serves as the core engine for modern booking applications.\n\n### Core Capabilities:\n- **Secure Authentication**: Robust role-based access control (RBAC) powered by Laravel Sanctum, ensuring data privacy and operational security.\n- **Resource Management**: Dynamic and highly configurable table allocation, capacity planning, and scheduling algorithms.\n- **Advanced Reservation System**: Sophisticated booking engine capable of handling future reservations, real-time availability conflict resolution, and instant walk-in assignments.\n- **Transaction Architecture**: Seamless and transactional payment state management, ensuring financial data integrity.\n- **Analytics & Telemetry**: Comprehensive real-time monitoring of table states and data-driven reporting for business intelligence.\n\n---\n\n*Architected and developed by **Wisnu Nugraha**.*",
    title: "Booking Billiard API",
)]
#[OA\Server(url: "/", description: "API Server")]
#[OA\SecurityScheme(securityScheme: "bearerAuth", type: "http", name: "bearerAuth", in: "header", bearerFormat: "JWT", scheme: "bearer")]
abstract class Controller
{
}
