class SearchTermForm extends React.Component {
    constructor(props) {
        super(props);

        this.handleChangeSearchTerm = this.handleChangeSearchTerm.bind(this);
        this.handleChangeZipCode = this.handleChangeZipCode.bind(this);
        this.handleChangeMaxDistance = this.handleChangeMaxDistance.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleChangeSearchTerm(event) {
        this.props.handleChangedSearch({ searchTerm: event.target.value });
    }

    handleChangeZipCode(event) {
        this.props.handleChangedSearch({ zipCode: event.target.value }, true);
    }

    handleChangeMaxDistance(event) {
        this.props.handleChangedSearch({ maxDistanceKm: event.target.value });
    }

    handleSubmit(event) {
        event.preventDefault();
        this.props.doSearch();
    }

    render() {
        const searchConditions = this.props.searchConditions;
        return (
            <form onSubmit={this.handleSubmit}>
                <div className="widget-content clearfix">
                    <div id="remote">
                        <input value={searchConditions.searchTerm} onChange={this.handleChangeSearchTerm} className="form-control walkthrough-1" type="text" id="q" placeholder="Search Jobs" />
                        <select className="form-control pull-left walkthrough-2" id="cmbDistance" onChange={this.handleChangeMaxDistance} value={searchConditions.maxDistance}>
                            <option value="0">Any distance from</option>
                            <option value="1">Within 1 KM of</option>
                            <option value="5">Within 5 KM of</option>
                            <option value="20">Within 20 KM of</option>
                            <option value="50">Within 50 KM of</option>
                        </select>
                        <input type="text" id="zipCode" className="form-control pull-left" value={searchConditions.zipCode} placeholder="ZIP" onChange={this.handleChangeZipCode} />
                        <input type="submit" className="search-submit" value=" " onClick={this.handleSubmit} />
                    </div>
                </div>
            </form>
        );
    }
}

class SearchFacet extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
        this.handleFacetedSearch = this.handleFacetedSearch.bind(this);
    }

    handleFacetedSearch(event, facetString) {
        event.preventDefault();
        let facetData = {};
        facetData[this.props.facetPropName] = facetString; // dynamically-named property
        this.props.handleChangedSearch(facetData, true);
    }

    render() {
        const facetItems = this.props.facetItems;
        if (this.props.facetPropName != "salaryRangeFacet") {
            return (
                <ul className="filter-list" id={this.props.facetId}>
                    {
                        facetItems.map((item) => (
                            <li><a href="javascript:void(0)" onClick={(event) => { this.handleFacetedSearch(event, item.value) }}>{item.value} ({item.count})</a></li>
                        ))
                    }
                </ul>
            )
        }
        else {

            return (
                <ul className="filter-list" id={this.props.facetId}>
                    {
                        facetItems.map((item) => {
                            var lowRange = parseInt(item.value);
                            var highRange = lowRange + 49999;
                            return <li><a href="javascript:void(0)" onClick={(event) => { this.handleFacetedSearch(event, item.value) }}>${lowRange.toLocaleString()} - ${highRange.toLocaleString()} ({item.count})</a></li>
                        })
                    }
                </ul>
            )
        }
    }
}

class JobsMap extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            // Load the initial data
            currentPage: 1,
            businessTitleFacet: '',
            postingTypeFacet: '',
            salaryRangeFacet: '',
            sortType: 'featured'
        }
    }

    render() {
        this.setState({
            infoboxLayer: new Microsoft.Maps.EntityCollection(),
            pinLayer: new Microsoft.Maps.EntityCollection()
        }),
            this.map = new Microsoft.Maps.Map(document.getElementById("jobs-page-map"),
                {
                    credentials: "Ag6emoVznJlat4hHnw7nrYGDlQ43ZjXAY7e-8R4bu8ZC7K1d8ORGhZMBkVu3KAVq",
                    center: new Microsoft.Maps.Location(40.736224, -73.992511),
                    zoom: 12
                });
    }
}

class SearchSort extends React.Component {
    constructor(props) {
        super(props);

        this.handleChangeSortBy = this.handleChangeSortBy.bind(this);
    }

    handleChangeSortBy(event) {
        this.props.handleChangedSearch({ sortType: event.target.value }, true);
    }

    render() {
        const searchConditions = this.props.searchConditions;
        return (
            <select className="form-control pull-left" id="cmbSortType" onChange={this.handleChangeSortBy} value={searchConditions.sortType}>
                <option value="featured">Relevance</option>
                <option value="salaryDesc">Salary (High to Low)</option>
                <option value="salaryIncr">Salary (Low to High)</option>
                <option value="mostRecent">Most Recently Added</option>
            </select>
        );
    }
}

class Pager extends React.Component {
    constructor(props) {
        super(props);
        this.handleChangePage = this.handleChangePage.bind(this);
    }

    handleChangePage(event, i) {
        event.preventDefault();
        this.props.handleChangedSearch({ currentPage: i }, true);
    }

    render() {
        const totalJobs = this.props.totalJobs;
        const currentPage = this.props.currentPage;
        let pagerItems = [];
        if (totalJobs > 0) {
            let totalPages = Math.round(totalJobs / 10);
            let showPageFrom = currentPage < 3 ? 1 : currentPage - 2;
            let showPageTo = Math.min(showPageFrom + 5, totalPages + 1);
            let previousPage = Math.max(currentPage - 1, 1);
            let nextPage = Math.min(currentPage + 1, totalPages);
            pagerItems.push(<li><a href="#" className="fa fa-angle-left" onClick={(event) => { this.handleChangePage(event, previousPage) }}></a></li>);
            for (let i = showPageFrom; i < showPageTo; i++) {
                pagerItems.push(<li><a href="#" onClick={(event) => { this.handleChangePage(event, i) }}>{i}</a></li>);
            }
            pagerItems.push(<li><a href="#" className="fa fa-angle-left" onClick={(event) => { this.handleChangePage(event, nextPage) }} className="fa fa-angle-right"></a></li>);
        }
        return (
            <ul id="pagination" className="pagination pull-right">
                {pagerItems}
            </ul>
        )
    }
}

class SearchResultList extends React.Component {
    constructor(props) {
        super(props);
    }
    render() {
        const pageOfResults = this.props.pageOfResults;
        return (
            <div id="job_details_div">
                {
                    pageOfResults.map((item) => (
                        <SearchResultItem value={item.document}></SearchResultItem>
                    ))
                }
            </div>
        )
    }
}

class SearchResultItem extends React.Component {
    constructor(props) {
        super(props);
    }
    render() {
        let monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
        let date = new Date(this.props.value.posting_date);
        return (
            <div className="jobs-item with-thumb">
                <div className="thumb"><img src="/images/content/bus-01.png" alt="" /></div>
                <div className="clearfix visible-xs"></div>
                <div className="date">{date.getDay()} <span>{monthNames[date.getMonth()]}</span></div>
                <h6 className="title"><a href={"/home/jobdetails?id=" + this.props.value.id}>{this.props.value.business_title}</a>&nbsp;
                        {this.props.value.tags.length ? "- Featured Job" : ""}</h6>
                <span className="meta">{this.props.value.work_location}</span>
                <p className="description"><b>Salary:</b> ${this.props.value.salary_range_from.toLocaleString()}
                    {
                        this.props.value.salary_range_to > this.props.value.salary_range_from ?
                            " to $" + this.props.value.salary_range_to.toLocaleString() :
                            ""
                    }
                    &nbsp;{this.props.value.salary_frequency}</p>
                <p class="description">{this.props.value.job_description.substring(0, 500)}&nbsp;&nbsp;&nbsp;<a href={"/home/jobdetails?id=" + this.props.value.id} class="read-more">Read More</a></p>
            </div>
        )
    }
}

class SearchApp extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            searchConditions: {
                searchTerm: '',
                maxDistanceKm: 0,
                zipCode: 10001,
                currentPage: 1,
                sortType: 'featured'
            },
            searchResultObject: {
                results: [],
                facets: {
                    business_title: [],
                    posting_type: [],
                    salary_range_from: []
                }
            }
        }

        this.handleChangedSearch = this.handleChangedSearch.bind(this);
        this.doSearch = this.doSearch.bind(this);
    }

    componentDidMount() {
        this.doSearch();
        new JobsMap().render();
    }

    handleChangedSearch(updateObject, runSearch) {
        var updatedSearchConditions = Object.assign({}, this.state.searchConditions, updateObject);

        if (runSearch) {
            // this callback guarantees that the state is updated before the function gets called
            this.setState({ searchConditions: updatedSearchConditions }, () => this.doSearch());
        }
        else {
            this.setState({ searchConditions: updatedSearchConditions });
        }
        console.log(this.state);
    }

    doSearch() {
        var postData = JSON.stringify(this.state.searchConditions);
        var app = this;

        fetch("api/search",
            {
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                method: "POST",
                body: postData
            })
            .then(function (response) {
                return response.json();
            })
            .then(function (result) {
                console.log(result);
                app.setState({ searchResultObject: result });
            })
            .catch(function (res) { console.log(res) })
    }

    render() {
        return (
            <div className="row">
                <div className="col-sm-4 page-sidebar">
                    <aside>
                        <div className="sidebar-container">
                            <div className="widget sidebar-widget jobs-search-widget">
                                <h5 className="widget-title" id="title">Search</h5>
                                <SearchTermForm searchConditions={this.state.searchConditions}
                                    handleChangedSearch={this.handleChangedSearch}
                                    doSearch={this.doSearch}>
                                </SearchTermForm>
                            </div>
                            <div className="widget sidebar-widget jobs-filter-widget">
                                <h5 className="widget-title">Filter Results</h5>
                                <p id="filterReset"></p>
                                <div className="widget-content">
                                    <h6 id="businessTitleFacetTitle">Business Title</h6>
                                    <SearchFacet facetId="business_title_facets" facetPropName="businessTitleFacet" handleChangedSearch={this.handleChangedSearch} facetItems={this.state.searchResultObject.facets.business_title}></SearchFacet>
                                    <h6>Posting Type</h6>
                                    <SearchFacet facetId="posting_type_facets" facetPropName="postingTypeFacet" handleChangedSearch={this.handleChangedSearch} facetItems={this.state.searchResultObject.facets.posting_type}></SearchFacet>
                                    <h6>Minimum Salary</h6>
                                    <ul className="filter-list" id="salary_range_facets"></ul>
                                    <SearchFacet facetId="salary_range_facets" facetPropName="salaryRangeFacet" handleChangedSearch={this.handleChangedSearch} facetItems={this.state.searchResultObject.facets.salary_range_from}></SearchFacet>
                                </div>
                            </div>
                        </div>
                    </aside>
                </div> {/*end .page-sidebar */}
                <div className="col-sm-8 page-content">
                    <div id="jobs-page-map" style={{ position: 'relative', width: 750 + 'px', height: 350 + 'px' }}>
                    </div>
                    <h3><span className="jobs-count" id="jobs-count">{this.state.searchResultObject.count}</span> Available Jobs</h3>
                    <div className="clearfix">
                        <SearchSort searchConditions={this.state.searchConditions} handleChangedSearch={this.handleChangedSearch}></SearchSort>
                        <Pager handleChangedSearch={this.handleChangedSearch} totalJobs={this.state.searchResultObject.count} currentPage={this.state.searchConditions.currentPage}></Pager>
                    </div>
                    <SearchResultList pageOfResults={this.state.searchResultObject.results}></SearchResultList>
                    <div className="clearfix">
                        <Pager handleChangedSearch={this.handleChangedSearch} totalJobs={this.state.searchResultObject.count} currentPage={this.state.searchConditions.currentPage}></Pager>
                    </div>
                </div> {/* end .page-content */}
            </div> //end .container
        );
    }
}

// ========================================

function GetMap() {
    ReactDOM.render(
        <SearchApp />,
        document.getElementById('root')
    );
}