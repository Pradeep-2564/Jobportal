import React, { useState, useRef, useEffect } from "react";
import { Box, InputBase, List, ListItem, ListItemText, Typography } from "@mui/material";
import { styled } from "@mui/material/styles";
import AddLocationAltIcon from '@mui/icons-material/AddLocationAlt';
import SearchIcon from '@mui/icons-material/Search';
import LocationOnOutlinedIcon from '@mui/icons-material/LocationOnOutlined';

const SearchBarWrapper = styled(Box)({
  display: "flex",
  alignItems: "center",
  borderRadius: 999,
  backgroundColor: "#fff",
  border: "2px solid #f79615",
  overflow: "hidden",
  width: "100%",
  height: 48,
});

const SearchInput = styled(InputBase)({
  flex: 1,
  paddingLeft: 16,
  fontSize: "1rem",
  height: "100%",
  '& input': {
    '&::placeholder': {
      opacity: 1,
    },
  },
});

const SearchBtn = styled(Box)({
  backgroundColor: "#f79615",
  color: "#fff",
  height: "100%",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  padding: "0 16px",
  cursor: "pointer",
  "&:hover": {
    backgroundColor: "#e68913",
  },
});

const SuggestionList = styled(Box)(({ theme }) => ({
  position: 'absolute',
  width: '100%',
  maxHeight: '300px',
  overflowY: 'auto',
  zIndex: 1,
  marginTop: '4px',
  backgroundColor: theme.palette.background.paper,
  borderRadius: '4px',
  boxShadow: theme.shadows[3],
}));

const SeoSearchSection = ({ 
  onLocationSelect, 
  placeholder = 'Location', 
  value = '', 
  onChange,
  error = false,
  helperText = ''
}) => {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const searchRef = useRef(null);

  // Handle outside click
  useEffect(() => {
    function handleClickOutside(event) {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowSuggestions(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Fetch location suggestions
  const fetchSuggestions = async (input) => {
    if (!input.trim()) {
      setSuggestions([]);
      return;
    }

    try {
      const response = await fetch(
        `https://maps.googleapis.com/maps/api/place/autocomplete/json?input=${encodeURIComponent(
          input
        )}&key=YOUR_GOOGLE_MAPS_API_KEY&types=(cities)`
      );
      const data = await response.json();
      
      if (data.predictions) {
        setSuggestions(data.predictions);
        setShowSuggestions(true);
      }
    } catch (error) {
      console.error('Error fetching location suggestions:', error);
      setSuggestions([]);
    }
  };

  const handleChange = (e) => {
    const value = e.target.value;
    setQuery(value);
    
    if (value.length > 2) {
      fetchSuggestions(value);
      setShowSuggestions(true);
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
    }
  };

  const handleSelectSuggestion = (suggestion) => {
    // Extract city and country from the suggestion
    const addressComponents = suggestion.terms || [];
    const city = addressComponents[0]?.value || '';
    const country = addressComponents[addressComponents.length - 1]?.value || '';
    
    // Format the display text as "City, Country"
    const displayText = [city, country].filter(Boolean).join(', ');
    
    setQuery(displayText);
    setShowSuggestions(false);
    
    // Pass the complete location data to the parent
    if (onLocationSelect) {
      onLocationSelect({
        description: displayText,
        city: city,
        country: country,
        fullAddress: suggestion.description,
        placeId: suggestion.place_id,
        structured_formatting: suggestion.structured_formatting
      });
    }
    
    if (onChange) {
      onChange(displayText);
    }
  };

  const handleSearch = () => {
    if (query.trim()) {
      onLocationSelect?.({ description: query });
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  return (
    <Box sx={{ position: 'relative', width: '100%' }} ref={searchRef}>
      <SearchBarWrapper sx={{
        borderColor: error ? 'error.main' : '#f79615',
        '&:hover': {
          borderColor: error ? 'error.dark' : '#f79615',
        },
      }}>
        <AddLocationAltIcon sx={{ color: error ? 'error.main' : "#f79615", ml: 1.5, mr: 1 }} />
        <SearchInput
          placeholder={placeholder}
          value={query}
          onChange={handleChange}
          onFocus={() => setShowSuggestions(suggestions.length > 0)}
          onKeyPress={handleKeyPress}
          sx={{
            '& input': {
              color: error ? 'error.main' : 'inherit',
            },
            '& input::placeholder': {
              color: error ? 'error.light' : 'text.disabled',
              opacity: 1,
            },
          }}
        />
        <SearchBtn onClick={handleSearch}>
          <SearchIcon sx={{ color: '#fff' }} />
        </SearchBtn>
      </SearchBarWrapper>
      
      {helperText && (
        <Typography variant="caption" color="error" sx={{ mt: 0.5, ml: 2, display: 'block' }}>
          {helperText}
        </Typography>
      )}
      
      {showSuggestions && suggestions.length > 0 && (
        <SuggestionList>
          {suggestions.map((suggestion, index) => {
            // Extract city and country from the suggestion
            const addressComponents = suggestion.terms || [];
            const city = addressComponents[0]?.value || '';
            const country = addressComponents[addressComponents.length - 1]?.value || '';
            const displayText = [city, country].filter(Boolean).join(', ');
            
            return (
              <ListItem 
                key={suggestion.place_id} 
                button 
                onClick={() => handleSelectSuggestion(suggestion)}
                sx={{ '&:hover': { bgcolor: 'action.hover' } }}
              >
                <LocationOnOutlinedIcon sx={{ color: 'text.secondary', mr: 1.5 }} />
                <ListItemText 
                  primary={displayText} 
                  secondary={suggestion.structured_formatting?.secondary_text || ''}
                />
              </ListItem>
            );
          })}
        </SuggestionList>
      )}
    </Box>
  );
};

export default SeoSearchSection;
