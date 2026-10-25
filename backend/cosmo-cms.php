<?php
/**
 * Plugin Name: Cosmo CMS Types
 * Description: Custom post types for Cosmo School headless frontend (teachers, testimonials, events, site options).
 */

function cosmo_register_cms_types() {
  $common = [
    "public" => true,
    "show_in_rest" => true,
    "supports" => ["title", "editor", "thumbnail", "custom-fields"],
    "has_archive" => false,
  ];

  register_post_type("teacher", array_merge($common, [
    "labels" => ["name" => "Teachers", "singular_name" => "Teacher"],
    "menu_icon" => "dashicons-businessperson",
    "rest_base" => "teachers",
  ]));

  register_post_type("testimonial", array_merge($common, [
    "labels" => ["name" => "Testimonials", "singular_name" => "Testimonial"],
    "menu_icon" => "dashicons-format-quote",
    "rest_base" => "testimonials",
  ]));

  register_post_type("cmsevent", array_merge($common, [
    "labels" => ["name" => "Events", "singular_name" => "Event"],
    "menu_icon" => "dashicons-calendar-alt",
    "rest_base" => "events",
  ]));

  register_post_type("program", array_merge($common, [
    "labels" => ["name" => "Programs", "singular_name" => "Program"],
    "menu_icon" => "dashicons-welcome-learn-more",
    "rest_base" => "programs",
  ]));

  register_post_type("club", array_merge($common, [
    "labels" => ["name" => "Clubs", "singular_name" => "Club"],
    "menu_icon" => "dashicons-groups",
    "rest_base" => "clubs",
  ]));

  register_post_type("galleryitem", array_merge($common, [
    "labels" => ["name" => "Gallery", "singular_name" => "Gallery Item"],
    "menu_icon" => "dashicons-format-gallery",
    "rest_base" => "gallery",
  ]));

  // Key-value JSON docs: slug = hero | fees | stats | daycarePlans | media
  register_post_type("siteoption", array_merge($common, [
    "labels" => ["name" => "Site Options", "singular_name" => "Site Option"],
    "menu_icon" => "dashicons-admin-settings",
    "rest_base" => "siteoptions",
    "supports" => ["title", "editor"],
  ]));

  foreach (["role_bn", "role_en", "subject", "exp", "meta_line", "event_date", "event_kind", "title_en", "desc_en", "age", "cat", "img_src"] as $key) {
    foreach (["teacher", "testimonial", "cmsevent", "program", "club", "galleryitem"] as $type) {
      register_post_meta($type, $key, [
        "show_in_rest" => true,
        "single" => true,
        "type" => "string",
      ]);
    }
  }
}
add_action("init", "cosmo_register_cms_types");
