<?php
/**
 * Customizer: Kontakt- & Mediendaten unter „Netwitcher Einstellungen“.
 *
 * @package Netwitcher
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

function nw_customize_register( $wp_customize ) {
	$wp_customize->add_section(
		'nw_settings',
		array(
			'title'    => __( 'Netwitcher Einstellungen', 'netwitcher' ),
			'priority' => 30,
		)
	);

	$fields = array(
		'email'       => array( 'E-Mail-Adresse', 'text' ),
		'phone'       => array( 'Telefonnummer (Anzeige)', 'text' ),
		'whatsapp'    => array( 'WhatsApp-Nummer (nur Ziffern, mit Ländercode)', 'text' ),
		'street'      => array( 'Straße & Hausnummer', 'text' ),
		'zip'         => array( 'PLZ', 'text' ),
		'city'        => array( 'Stadt', 'text' ),
		'calendly'    => array( 'Calendly-URL', 'url' ),
		'instagram'   => array( 'Instagram-URL', 'url' ),
		'linkedin'    => array( 'LinkedIn-URL', 'url' ),
		'tiktok'      => array( 'TikTok-URL', 'url' ),
		'hero_video'  => array( 'Hero-Video-URL (MP4-Loop)', 'url' ),
		'img_studio'  => array( 'Bild-URL: Studio Berlin', 'url' ),
		'img_product' => array( 'Bild-URL: Produktfotografie', 'url' ),
		'img_reels'   => array( 'Bild-URL: Reels-Produktion', 'url' ),
	);

	foreach ( $fields as $key => $conf ) {
		$wp_customize->add_setting(
			'nw_' . $key,
			array(
				'default'           => '',
				'sanitize_callback' => 'url' === $conf[1] ? 'esc_url_raw' : 'sanitize_text_field',
			)
		);
		$wp_customize->add_control(
			'nw_' . $key,
			array(
				'label'   => $conf[0],
				'section' => 'nw_settings',
				'type'    => 'url' === $conf[1] ? 'url' : 'text',
			)
		);
	}
}
add_action( 'customize_register', 'nw_customize_register' );
