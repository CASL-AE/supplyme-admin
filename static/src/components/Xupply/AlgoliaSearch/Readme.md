# Algolia Search 
**USAGE**

import the search component (Search) from `Xupply/AlgoliaSearch` into the required page

Props required for search: `indexName`

## Result component
<a href="https://github.com/dangell7/supplyme-admin/blob/c2d3cd3647b34fd84c4a353dc22529469cfd111b/static/src/containers/Xupply/MenuItem/MenuItemListView.js#L172-L176">Example</a>
This is the component in which the results (hits) will be displayed in.

## Seting up the Result Component
<a href="https://github.com/dangell7/supplyme-admin/blob/c2d3cd3647b34fd84c4a353dc22529469cfd111b/static/src/components/Xupply/MenuItem/MenuItemResultsTable.js#L12-L20">Example</a>
import { HitComponent, PaginationComponent } from `Xupply/AlgoliaSearch`

The HitComponent is a component with the mapping of results from Algolia.

Props required for `HitComponent`: The component for a result's row.

The PaginationComponent is a component used in controlling the Pagination of the results


## Setting up the Result Table
<a href="https://github.com/dangell7/supplyme-admin/blob/c2d3cd3647b34fd84c4a353dc22529469cfd111b/static/src/components/Xupply/MenuItem/MenuItemResultsTable.js#L21-L70">Example</a>