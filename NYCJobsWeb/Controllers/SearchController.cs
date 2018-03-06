using Microsoft.Azure.Search.Models;
using NYCJobsWeb.Models;
using System;
using System.Collections.Generic;
using System.Globalization;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Threading.Tasks;
using System.Web.Http;

namespace NYCJobsWeb.Controllers
{
    [RoutePrefix("search")]
    public class SearchController : ApiController
    {
        private JobsSearch _searchService;

        /// <summary>
        /// Poor man's version of depedency injection
        /// </summary>
        /// <param name="searchService"></param>
        public SearchController(JobsSearch searchService)
        {
            this._searchService = searchService;
        }

        public SearchController()
        {
            this._searchService = new JobsSearch();
        }

        public async Task<IHttpActionResult> Post(SearchInput input)
        {
            if (string.IsNullOrWhiteSpace(input.SearchTerm))
            {
                input.SearchTerm = "*";
            }                

            string maxDistanceLat = string.Empty;
            string maxDistanceLon = string.Empty;

            if (input.MaxDistance > 0)
            {
                var zipReponse = this._searchService.SearchZip(input.ZipCode.ToString());
                foreach (var result in zipReponse.Results)
                {
                    var doc = (dynamic)result.Document;
                    maxDistanceLat = Convert.ToString(doc["geo_location"].Latitude, CultureInfo.InvariantCulture);
                    maxDistanceLon = Convert.ToString(doc["geo_location"].Longitude, CultureInfo.InvariantCulture);
                }
            }

            var searchResponse = this._searchService.Search(input.SearchTerm,
                input.BusinessTitleFacet,
                input.PostingTypeFacet,
                input.SalaryRangeFacet,
                null,
                input.Latitude,
                input.Longitude,
                input.CurrentPage,
                input.MaxDistance,
                maxDistanceLat,
                maxDistanceLon);
            //return Ok(searchResponse.Results);

            return Ok(new NYCJob() { Results = searchResponse.Results, Facets = searchResponse.Facets, Count = Convert.ToInt32(searchResponse.Count) });
        }
    }
}
