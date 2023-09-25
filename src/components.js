import { FormTokenField } from '@wordpress/components';
import { __, _n } from '@wordpress/i18n';

const getPostIdByPostValue = ( posts, postValue ) => {
	const postId =
    postValue?.id || posts.find( ( post ) => post.title.rendered === postValue )?.id;
	if ( postId ) {
		return postId;
	}

	const postValueLower = postValue.toLocaleLowerCase();
	return posts.find(
		( post ) => post.title.rendered.toLocaleLowerCase() === postValueLower
	)?.id;
};

export const PostItem = ( { post_label, posts, value, onChange } ) => {

	if ( ! posts?.length ) {
		return null;
	}

	const onPostChange = ( newPostValues ) => {
		const postIds = new Set();
        const postValues = new Set();
		for ( const postValue of newPostValues ) {
			const postId = getPostIdByPostValue( posts, postValue );

			if ( postId ) {
				postIds.add( postId );
                // The FormTokenField on change event is doing some strange thing. All the values inside the array other than the last one are returned as object.
                postValues.add( postValue.value ? postValue.value : postValue );
			}
		}
        
		onChange( Array.from( postIds ) );
	};

    // Selects only the existing term ids in proper format to be
	// used in `FormTokenField`. This prevents the component from
	// crashing in the editor, when non existing term ids were provided.
	const inputValue = value
    .map( ( postId ) => posts.find( ( t ) => t.id === postId ) )
    .filter( Boolean )
    .map( ( post ) => ( { id: post.id, value: post.title.rendered } ) );

	return (
		<div className="block-library-query-inspector__taxonomy-control">
			<FormTokenField
				label={ post_label }
				value={ inputValue }
				suggestions={ posts.map( ( t ) => t.title.rendered ) }
				onChange={ onPostChange }
			/>
		</div>
	);
}