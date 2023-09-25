const { createHigherOrderComponent } = wp.compose;
const { Fragment } = wp.element;
const { InspectorControls } = wp.blockEditor;
const { PanelBody, ToggleControl, PanelRow } = wp.components;
import { useEffect, useState, useRef } from '@wordpress/element';
import { PostItem } from './components';
const { union } = lodash;

/**
 * Add additional controls to core/post-template block.
 */
const withInspectorControls = createHigherOrderComponent( ( BlockEdit ) => {

    return ( props ) => {
        const { name, attributes, setAttributes } = props;
        const { query } = attributes;
        const currentPostId = wp.data.select("core/editor").getCurrentPostId();
        const currentPostType = wp.data.select("core/editor").getCurrentPostType();
        const [ allPosts, setAllPosts ] = useState( [] );
        const prevQuery = useRef( query );

        if( 'core/query' !== name ) {
            return <BlockEdit { ...props } />;
        }

        const removePostIdsFromArray = ( array, postIds ) => {
            return array.filter((id) => {
                return ! postIds.includes( id );
            });
        };

        const addPostIdsToArray = ( array, postIds ) => {
            return union( array, postIds );
        }

        useEffect(() => {
            const getAllPosts = async () => {
                // Wait for WP API to load
                await wp.api.loadPromise;

                const postsCollection = 'post' === query.postType ? new wp.api.collections.Posts() : new wp.api.collections.Pages();
                let data = await postsCollection.fetch( {
                    data: { per_page: 100, post_type: query.postType, status: 'publish' }
                } );

                while( postsCollection.hasMore() ) {
                    const moreData = await postsCollection.more();
                    data = data.concat( moreData );
                }

                setAllPosts( data );
            }

            if( prevQuery.postType ) {
                setAttributes({
                    query: {
                        ...query,
                        exclude: []
                    }
                });
            }
            getAllPosts();
        }, [query.postType])

        return (
            <Fragment>
                <BlockEdit { ...props } />
                <InspectorControls>
                    <PanelBody title="Exclude Posts" initialOpen={ false }>
                        { currentPostType === query.postType ? (
                            <PanelRow>
                            <ToggleControl
                                label="Exclude Current Post"
                                help={
                                    query.exclude.includes(currentPostId)
                                        ? 'Exclude current post from query results.'
                                        : 'Include current post from query results.'
                                }
                                checked={ query.exclude.includes(currentPostId) }
                                onChange={ () => {
                                    setAttributes( {
                                        query: {
                                            ...query,
                                            exclude: ! query.exclude.includes(currentPostId) ? addPostIdsToArray( query.exclude, [ currentPostId ] ) : removePostIdsFromArray( query.exclude, [ currentPostId ] )
                                        }
                                    });
                                } }
                            />
                        </PanelRow>
                        ) : null }
                        <PanelRow>
                            <PostItem
                                post_label='Excluded Posts'
                                posts={ allPosts }
                                value={ query.exclude }
                                onChange={ newPosts => {
                                    setAttributes({
                                        query: {
                                            ...query,
                                            exclude: newPosts
                                        }
                                    });
                                }}
                            />
                        </PanelRow>
                    </PanelBody>
                </InspectorControls>
            </Fragment>
        );
    };
}, 'withInspectorControl' );

wp.hooks.addFilter(
    'editor.BlockEdit',
    'query-block-extension/exclude-posts/add-controls',
    withInspectorControls
);