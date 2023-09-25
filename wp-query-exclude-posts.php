<?php
/**
 *
 * Plugin Name:       WP Query Block Extension - Exclude Posts
 * Description:       Add 'exclude' control to Query Loop block allows user to exclude current post or selected posts from query results.
 * Version:           1.0
 * Author:            Kelvin Xu
 * License:           GPL-2.0+
 * License URI:       http://www.gnu.org/licenses/gpl-2.0.txt
 * Text Domain:       wp-query-block-extension
 *
 * @package ubc_query_block_extension
 */

namespace UBC\CTLT\BLOCKS\QUERY_BLOCK\EXCLUDE_POSTS;

// If this file is called directly, abort.
if ( ! defined( 'ABSPATH' ) ) {
	die;
}

add_action( 'enqueue_block_editor_assets', __NAMESPACE__ . '\\enqueue_assets' );

/**
 * Enqueue block assets.
 *
 * @return void
 */
function enqueue_assets() {

	wp_enqueue_script( 'wp-api' );

	wp_enqueue_script(
		'wp-query-block-exclude-posts-js',
		plugin_dir_url( __FILE__ ) . 'build/script.js',
		array(),
		filemtime( plugin_dir_path( __FILE__ ) . 'build/script.js' ),
		true
	);

}//end enqueue_assets()
