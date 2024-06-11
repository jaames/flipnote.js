/**
 * ## Flipnote Playlist Files
 * 
 * Flipnote Studio and Flipnote Studio 3D both create "playlist" files, primarily for indexing Flipnotes.
 * Playlists are essentially just list the paths of Flipnotes, and can serve various purposes..
 * 
 * This module contains functions for parsing Flipnote playlist files.
 */
export type { Path } from './Base';
export * from './PpmPlaylist';
export * from './KwzPlaylist';
export * from './parse';