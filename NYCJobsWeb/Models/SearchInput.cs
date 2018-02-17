using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace NYCJobsWeb.Models
{
    public class SearchInput
    {
        public string SearchTerm { get; set; }
        public int MaxDistance { get; set; }
        public int ZipCode { get; set; }
        public double Latitude { get; set; }
        public double Longitude { get; set; }
        public int CurrentPage { get; set; }

        public SearchInput()
        {
            this.ZipCode = 10001;
            this.Latitude = 40.736224;
            this.Longitude = -73.99251;
            this.CurrentPage = 1;
        }
    }
}