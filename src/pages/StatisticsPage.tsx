import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Calendar,
  Eye,
  TrendingUp,
  Users,
  DollarSign,
  RefreshCw,
  Search,
  BarChart3,
} from "lucide-react";
import { useStatisticsStore } from "../store/statisticsStore";
import { usePropertiesStore } from "../store/propertiesStore";

const StatisticsPage = () => {
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [selectedPropertyId, setSelectedPropertyId] = useState("");

  const {
    totalSales,
    topViewedProperties,
    newUsers,
    propertyViews,
    loading: statsLoading,
    propertyViewsLoading, // Add new loading state
    error: statsError,
    setError: setStatsError,
    fetchTotalSales,
    fetchTopViewedProperties,
    fetchNewUsers,
    fetchPropertyViews,
  } = useStatisticsStore();

  const {
    properties,
    loading: propertiesLoading,
    error: propertiesError,
    fetchAll: fetchProperties,
  } = usePropertiesStore();

  // Initialize with current date range (last 30 days)
  useEffect(() => {
    const end = new Date();
    const start = new Date();
    start.setDate(start.getDate() - 30);

    setEndDate(end.toISOString().split("T")[0]);
    setStartDate(start.toISOString().split("T")[0]);
  }, []);

  // Fetch properties on mount
  useEffect(() => {
    fetchProperties(); // Fetch all properties without a filter
  }, [fetchProperties]);

  // Load initial statistics data
  useEffect(() => {
    if (startDate && endDate) {
      handleRefreshAll();
    }
  }, [startDate, endDate]);

  const handleRefreshAll = async () => {
    if (!startDate || !endDate) {
      setStatsError("Please select both start and end dates");
      return;
    }

    try {
      await Promise.all([
        fetchTotalSales(startDate, endDate),
        fetchTopViewedProperties(startDate, endDate),
        fetchNewUsers(startDate, endDate),
      ]);
    } catch (err) {
      setStatsError("Failed to fetch statistics");
    }
  };

  const handlePropertyViewsSearch = async () => {
    if (!selectedPropertyId || !startDate || !endDate) {
      setStatsError("Please select a property and date range");
      return;
    }

    await fetchPropertyViews(selectedPropertyId, startDate, endDate);
  };

  const formatPrice = (price: string, currency: string) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: currency || "USD",
    }).format(Number(price));
  };

  // Get property name by ID
  const getPropertyName = (propertyId: string) => {
    const property = properties.find((p) => p.id === propertyId);
    return property ? property.title : propertyId;
  };

  return (
    <div className="min-h-screen bg-background p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">
              Statistics Dashboard
            </h1>
            <p className="text-muted-foreground">
              Monitor your property platform performance and analytics
            </p>
          </div>
          <Button
            onClick={handleRefreshAll}
            disabled={statsLoading || propertiesLoading}
            className="w-fit"
          >
            <RefreshCw
              className={`w-4 h-4 mr-2 ${statsLoading ? "animate-spin" : ""}`}
            />
            Refresh Data
          </Button>
        </div>

        {/* Date Range Selector */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="w-5 h-5" />
              Date Range
            </CardTitle>
            <CardDescription>
              Select the time period for statistics analysis
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="startDate">Start Date</Label>
                <Input
                  id="startDate"
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="endDate">End Date</Label>
                <Input
                  id="endDate"
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Error Messages */}
        {(statsError || propertiesError) && (
          <div className="bg-destructive/10 border border-destructive/20 text-destructive px-4 py-3 rounded-lg">
            {statsError || propertiesError}
          </div>
        )}

        {/* Statistics Cards Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Combined Sales & Users Card */}
          <Card className="bg-gradient-to-r from-blue-50 via-indigo-50 to-green-50 dark:from-blue-950/20 dark:via-indigo-950/20 dark:to-green-950/20 border-gradient">
            <CardContent className="p-6">
              <div className="grid grid-cols-1 gap-6 divide-y divide-border">
                {/* Total Sales Section */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-sm font-medium text-blue-700 dark:text-blue-300">
                      Total Sales
                    </CardTitle>
                    <DollarSign className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                  </div>
                  {statsLoading || !totalSales ? (
                    <div className="space-y-2">
                      <Skeleton className="h-8 w-20" />
                      <Skeleton className="h-4 w-32" />
                    </div>
                  ) : (
                    <div>
                      <div className="text-3xl font-bold text-blue-700 dark:text-blue-300">
                        {totalSales.totalSales}
                      </div>
                      <p className="text-sm text-blue-600 dark:text-blue-400 mb-8">
                        {formatPrice(totalSales.totalAmount, "USD")} total value
                      </p>
                    </div>
                  )}
                </div>

                {/* New Users Section */}
                <div className="space-y-3 pt-6 sm:pt-0">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-sm font-medium text-green-700 dark:text-green-300">
                      New Users
                    </CardTitle>
                    <Users className="h-5 w-5 text-green-600 dark:text-green-400" />
                  </div>
                  {statsLoading || !newUsers ? (
                    <div className="space-y-2">
                      <Skeleton className="h-8 w-20" />
                      <Skeleton className="h-4 w-full" />
                    </div>
                  ) : (
                    <div>
                      <div className="text-3xl font-bold text-green-700 dark:text-green-300">
                        {newUsers.new_buyers +
                          newUsers.new_sellers +
                          newUsers.new_agencies}
                      </div>
                      <div className="flex flex-wrap gap-1 mt-2">
                        <Badge variant="secondary" className="text-xs">
                          {newUsers.new_buyers} Buyers
                        </Badge>
                        <Badge variant="secondary" className="text-xs">
                          {newUsers.new_sellers} Sellers
                        </Badge>
                        <Badge variant="secondary" className="text-xs">
                          {newUsers.new_agencies} Agencies
                        </Badge>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Property Views Search Card - Enhanced */}
          <Card className="bg-gradient-to-br from-purple-50 to-violet-50 dark:from-purple-950/20 dark:to-violet-950/20 border-purple-200 dark:border-purple-800">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <BarChart3 className="h-4 w-4 text-purple-600 dark:text-purple-400" />
                Property Views Analytics
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Property Selection */}
              <div className="space-y-2">
                <Label htmlFor="propertySelect" className="text-sm font-medium">
                  Select Property
                </Label>
                <div className="flex gap-2">
                  <Select
                    value={selectedPropertyId}
                    onValueChange={setSelectedPropertyId}
                    disabled={propertiesLoading || properties.length === 0}
                  >
                    <SelectTrigger id="propertySelect" className="flex-1">
                      <SelectValue
                        placeholder={
                          propertiesLoading
                            ? "Loading properties..."
                            : properties.length === 0
                              ? "No properties available"
                              : "Choose a property to analyze"
                        }
                      />
                    </SelectTrigger>
                    <SelectContent>
                      {properties.map((property) => (
                        <SelectItem key={property.id} value={property.id}>
                          <div className="flex flex-col items-start">
                            <span className="font-medium">
                              {property.title}
                            </span>
                            <span className="text-xs text-muted-foreground truncate">
                              {property.address}
                            </span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Button
                    size="sm"
                    onClick={handlePropertyViewsSearch}
                    disabled={
                      propertyViewsLoading || // Use propertyViewsLoading
                      propertiesLoading ||
                      !selectedPropertyId
                    }
                    className="px-3"
                  >
                    <Search className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              {/* Results Display */}
              {propertyViewsLoading && selectedPropertyId ? ( // Use propertyViewsLoading
                <div className="p-4 rounded-lg bg-purple-50 dark:bg-purple-950/10 border border-purple-200 dark:border-purple-800">
                  <div className="flex items-center gap-2">
                    <RefreshCw className="w-4 h-4 animate-spin text-purple-600" />
                    <span className="text-sm text-purple-600 dark:text-purple-400">
                      Analyzing property views...
                    </span>
                  </div>
                </div>
              ) : propertyViews ? (
                <div className="p-4 rounded-lg bg-purple-50 dark:bg-purple-950/10 border border-purple-200 dark:border-purple-800">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-full bg-purple-100 dark:bg-purple-900">
                        <Eye className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                      </div>
                      <div>
                        <div className="text-2xl font-bold text-purple-700 dark:text-purple-300">
                          {propertyViews.views.toLocaleString()}
                        </div>
                        <p className="text-xs text-purple-600 dark:text-purple-400">
                          total views
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="mt-3 pt-3 border-t border-purple-200 dark:border-purple-700">
                    <p className="text-sm font-medium text-purple-700 dark:text-purple-300">
                      {getPropertyName(propertyViews.propertyId)}
                    </p>
                    <p className="text-xs text-purple-600 dark:text-purple-400 mt-1">
                      From {startDate} to {endDate}
                    </p>
                  </div>
                </div>
              ) : selectedPropertyId && !propertyViewsLoading ? (
                <div className="p-4 rounded-lg bg-gray-50 dark:bg-gray-900/50 border border-gray-200 dark:border-gray-700">
                  <p className="text-sm text-muted-foreground text-center">
                    Click the search button to analyze views for the selected
                    property
                  </p>
                </div>
              ) : (
                <div className="p-4 rounded-lg bg-gray-50 dark:bg-gray-900/50 border border-gray-200 dark:border-gray-700">
                  <p className="text-sm text-muted-foreground text-center">
                    Select a property to view its analytics
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Top Viewed Properties */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5" />
              Top Viewed Properties
            </CardTitle>
            <CardDescription>
              Most popular properties in the selected time period
            </CardDescription>
          </CardHeader>
          <CardContent>
            {statsLoading || topViewedProperties.length === 0 ? (
              <div className="space-y-4">
                {[...Array(5)].map((_, i) => (
                  <div key={i} className="flex items-center space-x-4">
                    <Skeleton className="h-12 w-12 rounded-lg" />
                    <div className="space-y-2 flex-1">
                      <Skeleton className="h-4 w-[250px]" />
                      <Skeleton className="h-4 w-[200px]" />
                    </div>
                    <Skeleton className="h-8 w-20" />
                  </div>
                ))}
              </div>
            ) : (
              <div className="space-y-4">
                {topViewedProperties.map((property, index) => (
                  <div
                    key={property.id}
                    className="flex items-center justify-between p-4 rounded-lg border bg-card hover:shadow-md transition-shadow"
                  >
                    <div className="flex items-center gap-4">
                      <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-primary/10 text-primary font-bold">
                        #{index + 1}
                      </div>
                      <div className="space-y-1">
                        <h4 className="font-medium leading-none">
                          {property.title}
                        </h4>
                        <p className="text-sm text-muted-foreground">
                          {property.address}
                        </p>
                        <div className="flex items-center gap-2">
                          <Badge variant="outline" className="text-xs">
                            {property.price}
                          </Badge>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="flex items-center gap-1 text-sm font-medium">
                        <Eye className="w-4 h-4" />
                        {property.view_count.toLocaleString()}
                      </div>
                      <p className="text-xs text-muted-foreground">views</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default StatisticsPage;
