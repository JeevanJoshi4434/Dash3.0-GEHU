"use client"

import { useRef, useEffect, useState } from "react"
import mapboxgl from "mapbox-gl"
import "mapbox-gl/dist/mapbox-gl.css"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Slider } from "@/components/ui/slider"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { MapPin, Navigation, Search, X, ChevronLeft, ChevronRight, Moon, Sun, Compass } from "lucide-react"

// Replace with your actual Mapbox token
mapboxgl.accessToken = "pk.eyJ1IjoiamVldmFuam9zaGkiLCJhIjoiY2x2djh0YnViMXN2cjJpcDFwaTg4Z3czYyJ9.zEDRwvJFAwXfIbV4hnmQIQ"

interface Location {
  id: string
  name: string
  shopName?: string
  description?: string
  category?: string
  latitude: number
  longitude: number
  distance?: number
}

interface UserLocation {
  name: string
  location: {
    latitude: number
    longitude: number
  }
}

interface MapBoxProps {
  locations?: Location[]
  user?: UserLocation | null
}

export default function MapBox({ locations = [], user = null }: MapBoxProps) {
  const mapContainer = useRef<HTMLDivElement>(null)
  const map = useRef<mapboxgl.Map | null>(null)
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [maxDistance, setMaxDistance] = useState(5) // in kilometers
  const [filteredLocations, setFilteredLocations] = useState<Location[]>([])
  const [selectedLocation, setSelectedLocation] = useState<Location | null>(null)
  const [mapStyle, setMapStyle] = useState("mapbox://styles/mapbox/streets-v12")
  const [darkMode, setDarkMode] = useState(false)
  const [userPosition, setUserPosition] = useState<{ lng: number; lat: number } | null>(
    user ? { lng: user.location.longitude, lat: user.location.latitude } : null,
  )
  const [zoom, setZoom] = useState(12)

  // Calculate distance between two points using Haversine formula
  const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number): number => {
    const R = 6371 // Radius of the earth in km
    const dLat = ((lat2 - lat1) * Math.PI) / 180
    const dLon = ((lon2 - lon1) * Math.PI) / 180
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos((lat1 * Math.PI) / 180) * Math.cos((lat2 * Math.PI) / 180) * Math.sin(dLon / 2) * Math.sin(dLon / 2)
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
    return R * c
  }

  // Get user's current location
  const getUserLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const newPosition = {
            lng: position.coords.longitude,
            lat: position.coords.latitude,
          }
          setUserPosition(newPosition)

          if (map.current) {
            map.current.flyTo({
              center: [newPosition.lng, newPosition.lat],
              zoom: 14,
              essential: true,
            })
          }
        },
        (error) => {
          console.error("Error getting location:", error)
        },
      )
    } else {
      console.error("Geolocation is not supported by this browser.")
    }
  }

  // Initialize map
  useEffect(() => {
    if (!mapContainer.current || map.current) return

    const initialPosition = userPosition || { lng: -74.006, lat: 40.7128 } // Default to NYC if no user position

    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: mapStyle,
      center: [initialPosition.lng, initialPosition.lat],
      zoom: zoom,
    })

    // Add navigation controls
    map.current.addControl(new mapboxgl.NavigationControl(), "top-right")
    map.current.addControl(new mapboxgl.FullscreenControl(), "top-right")
    map.current.addControl(
      new mapboxgl.GeolocateControl({
        positionOptions: {
          enableHighAccuracy: true,
        },
        trackUserLocation: true,
      }),
      "top-right",
    )

    // Update state when map moves
    map.current.on("move", () => {
      if (map.current) {
        setZoom(Number.parseFloat(map.current.getZoom().toFixed(2)))
      }
    })

    return () => {
      if (map.current) {
        map.current.remove()
        map.current = null
      }
    }
  }, [])

  // Update map style when it changes
  useEffect(() => {
    if (map.current) {
      map.current.setStyle(mapStyle)
    }
  }, [mapStyle])

  // Apply dark mode
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark")
    } else {
      document.documentElement.classList.remove("dark")
    }
  }, [darkMode])

  // Update markers when locations or user position changes
  useEffect(() => {
    if (!map.current || !userPosition) return

    // Clear existing markers
    const markers = document.querySelectorAll(".mapboxgl-marker")
    markers.forEach((marker) => marker.remove())

    // Add user marker
    const userMarkerElement = document.createElement("div")
    userMarkerElement.className = "user-marker"
    userMarkerElement.innerHTML = `
      <div class="w-8 h-8 bg-blue-500 rounded-full border-2 border-white flex items-center justify-center text-white">
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
      </div>
    `

    new mapboxgl.Marker(userMarkerElement)
      .setLngLat([userPosition.lng, userPosition.lat])
      .setPopup(new mapboxgl.Popup({ offset: 25 }).setHTML(`<h3>My Location</h3>`))
      .addTo(map.current)

    // Process and add location markers
    const locationsWithDistance = locations.map((location) => {
      const distance = calculateDistance(userPosition.lat, userPosition.lng, location.latitude, location.longitude)
      return { ...location, distance }
    })

    // Filter locations by distance and search query
    const filtered = locationsWithDistance
      .filter((location) => location.distance <= maxDistance)
      .filter(
        (location) =>
          location.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          (location.shopName && location.shopName.toLowerCase().includes(searchQuery.toLowerCase())),
      )
      .sort((a, b) => (a.distance || 0) - (b.distance || 0))

    setFilteredLocations(filtered)

    // Add markers for filtered locations
    filtered.forEach((location) => {
      const markerElement = document.createElement("div")
      markerElement.className = "location-marker"
      markerElement.innerHTML = `
        <div class="w-8 h-8 bg-red-500 rounded-full border-2 border-white flex items-center justify-center text-white">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"></path><circle cx="12" cy="10" r="3"></circle></svg>
        </div>
      `

      const marker = new mapboxgl.Marker(markerElement)
        .setLngLat([location.longitude, location.latitude])
        .addTo(map.current)

      // Create popup content
      const popupContent = `
        <div class="p-2">
          <h3 class="font-bold">${location.shopName || location.name}</h3>
          <p>${location.distance ? location.distance.toFixed(2) + " km away" : ""}</p>
        </div>
      `

      marker.setPopup(new mapboxgl.Popup({ offset: 25 }).setHTML(popupContent))

      // Add click event to marker
      markerElement.addEventListener("click", () => {
        setSelectedLocation(location)
      })
    })
  }, [locations, userPosition, maxDistance, searchQuery])

  // Fly to selected location
  useEffect(() => {
    if (map.current && selectedLocation) {
      map.current.flyTo({
        center: [selectedLocation.longitude, selectedLocation.latitude],
        zoom: 15,
        essential: true,
      })
    }
  }, [selectedLocation])

  return (
    <div className={`h-screen w-full flex ${darkMode ? "dark" : ""}`}>
      {/* Sidebar */}
      <div
        className={`${sidebarOpen ? "w-80" : "w-0"} bg-white dark:bg-gray-800 h-full transition-all duration-300 overflow-hidden flex flex-col border-r`}
      >
        <div className="p-4 border-b">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold dark:text-white">Nearby Locations</h2>
            <Button variant="ghost" size="icon" onClick={() => setSidebarOpen(false)}>
              <ChevronLeft className="h-5 w-5" />
            </Button>
          </div>

          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <Input
                placeholder="Search locations..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="flex-1"
              />
              <Button variant="outline" size="icon">
                <Search className="h-4 w-4" />
              </Button>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-500 dark:text-gray-400">Max Distance: {maxDistance} km</span>
              </div>
              <Slider
                value={[maxDistance]}
                min={1}
                max={20}
                step={1}
                onValueChange={(value) => setMaxDistance(value[0])}
              />
            </div>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-2">
          {filteredLocations.length === 0 ? (
            <div className="text-center p-4 text-gray-500 dark:text-gray-400">
              No locations found within {maxDistance} km
            </div>
          ) : (
            <div className="space-y-2">
              {filteredLocations.map((location) => (
                <Card
                  key={location.id}
                  className={`cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors ${
                    selectedLocation?.id === location.id ? "border-primary" : ""
                  }`}
                  onClick={() => setSelectedLocation(location)}
                >
                  <CardContent className="p-3">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-medium">{location.shopName || location.name}</h3>
                        {location.shopName && (
                          <p className="text-sm text-gray-500 dark:text-gray-400">{location.name}</p>
                        )}
                        <div className="flex items-center mt-1 text-sm text-gray-500 dark:text-gray-400">
                          <MapPin className="h-3 w-3 mr-1" />
                          {location.distance ? `${location.distance.toFixed(2)} km away` : "Distance unknown"}
                        </div>
                      </div>
                      <Badge variant="outline" className="ml-2">
                        {location.category || "Location"}
                      </Badge>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Map container */}
      <div className="flex-1 relative">
        <div ref={mapContainer} className="absolute inset-0" />

        {/* Map controls */}
        <div className="absolute top-4 left-4 z-10 flex flex-col space-y-2">
          {!sidebarOpen && (
            <Button
              variant="secondary"
              size="icon"
              className="bg-white dark:bg-gray-800 shadow-md"
              onClick={() => setSidebarOpen(true)}
            >
              <ChevronRight className="h-5 w-5" />
            </Button>
          )}

          <Button
            variant="secondary"
            size="icon"
            className="bg-white dark:bg-gray-800 shadow-md"
            onClick={getUserLocation}
          >
            <Navigation className="h-5 w-5" />
          </Button>

          <Button
            variant="secondary"
            size="icon"
            className="bg-white dark:bg-gray-800 shadow-md"
            onClick={() => setDarkMode(!darkMode)}
          >
            {darkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
          </Button>
        </div>

        {/* Map style selector */}
        <div className="absolute bottom-4 left-4 z-10">
          <Card className="w-auto bg-white dark:bg-gray-800 shadow-md">
            <CardContent className="p-2">
              <Tabs
                defaultValue="streets"
                onValueChange={(value) => {
                  switch (value) {
                    case "streets":
                      setMapStyle("mapbox://styles/mapbox/streets-v12")
                      break
                    case "satellite":
                      setMapStyle("mapbox://styles/mapbox/satellite-streets-v12")
                      break
                    case "dark":
                      setMapStyle("mapbox://styles/mapbox/dark-v11")
                      break
                    case "light":
                      setMapStyle("mapbox://styles/mapbox/light-v11")
                      break
                  }
                }}
              >
                <TabsList className="grid grid-cols-4 h-8">
                  <TabsTrigger value="streets" className="text-xs">
                    Streets
                  </TabsTrigger>
                  <TabsTrigger value="satellite" className="text-xs">
                    Satellite
                  </TabsTrigger>
                  <TabsTrigger value="dark" className="text-xs">
                    Dark
                  </TabsTrigger>
                  <TabsTrigger value="light" className="text-xs">
                    Light
                  </TabsTrigger>
                </TabsList>
              </Tabs>
            </CardContent>
          </Card>
        </div>

        {/* Location details panel */}
        {selectedLocation && (
          <div className="absolute top-4 right-4 z-10 w-80">
            <Card className="bg-white dark:bg-gray-800 shadow-lg">
              <CardHeader className="pb-2">
                <div className="flex justify-between items-center">
                  <CardTitle className="text-lg">{selectedLocation.shopName || selectedLocation.name}</CardTitle>
                  <Button variant="ghost" size="icon" onClick={() => setSelectedLocation(null)}>
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {selectedLocation.shopName && (
                  <div>
                    <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400">Name</h4>
                    <p>{selectedLocation.name}</p>
                  </div>
                )}

                {selectedLocation.description && (
                  <div>
                    <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400">Description</h4>
                    <p>{selectedLocation.description}</p>
                  </div>
                )}

                <div>
                  <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400">Distance</h4>
                  <p>
                    {selectedLocation.distance ? `${selectedLocation.distance.toFixed(2)} km away` : "Distance unknown"}
                  </p>
                </div>

                <div>
                  <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400">Coordinates</h4>
                  <p className="text-sm">
                    {selectedLocation.latitude.toFixed(6)}, {selectedLocation.longitude.toFixed(6)}
                  </p>
                </div>

                <div className="pt-2">
                  <Button
                    className="w-full"
                    onClick={() => {
                      if (userPosition) {
                        // Open directions in Google Maps
                        window.open(
                          `https://www.google.com/maps/dir/?api=1&origin=${userPosition.lat},${userPosition.lng}&destination=${selectedLocation.latitude},${selectedLocation.longitude}`,
                          "_blank",
                        )
                      }
                    }}
                  >
                    <Navigation className="h-4 w-4 mr-2" />
                    Get Directions
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Map info */}
        <div className="absolute bottom-4 right-4 z-10">
          <Card className="bg-white dark:bg-gray-800 shadow-md">
            <CardContent className="p-2 text-xs">
              <div className="flex items-center space-x-2">
                <Compass className="h-4 w-4" />
                <span>Zoom: {zoom}</span>
                {userPosition && (
                  <>
                    <span>|</span>
                    <span>
                      {userPosition.lat.toFixed(4)}, {userPosition.lng.toFixed(4)}
                    </span>
                  </>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

