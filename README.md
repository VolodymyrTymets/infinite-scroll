# Meteor Infinite Scroll
**Enables infinite scrolling at the template level**. You can enable `limit` increasing by using `onLoaded` function which invokes every scroll down container event occurs.

## Usage:

Call `this.infiniteScroll` in the `created` or `rendered` functions for your template.

```js
Template.comments.created = function() {
  // Enable infinite scrolling on this template
  this.infiniteScroll({
    isDataReady: () => ReactiveVar.get(); // function which calls reactive variable.
                                          // Also it could be like () => subscription.ready();
                                          // but in this case, subscription should be stored in ReactiveVar first.
    container: '#selector'                // (optional) Selector to scroll div.
    loadingTemplateName:'loading'         // (optional) Name Of loading template
    onLoaded: function () {}              // called on scrolled down container
  });
};
```
Render your data as usual. Render the `{{> infiniteScroll }}` template after your data is rendered:

```handlebars
<template name="comments">
    {{#each comments}}
        {{content}}
    {{/each}}
    {{> infiniteScroll }}
</template>
```
> Infinite Scroll will invoke `onLoaded` callback as the `{{> infiniteScroll }}` template approaches the viewport.

Provide data to the template as you usually would.

```js
Template.comments.helpers({
  comments: function() {
    return Comments.find({ post: 71 },  {
        sort: {
            created: 1
        }
    });
  }
});
```
## Styling the loader
The `{{> infiniteScroll }}` template renders:
```html
<template name="infiniteScroll">
  <div class="infinite-load-more">
    <div class="infinite-label">
      Loading...
    </div>
  </div>
</template>
```

When data is loading, `.infinite-load-more` will receive the class `loading`. It will be removed when the data is received.

`.infinite-label` is only visible when the data is loading.

# Todo:
- Customizable threshold for loading more results
