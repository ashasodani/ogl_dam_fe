// React Imports
import { useState, useEffect } from 'react'

import { useDispatch, useSelector } from 'react-redux'

import { useForm, Controller } from 'react-hook-form'
// MUI Imports
import CardContent from '@mui/material/CardContent'
import FormControl from '@mui/material/FormControl'
import Grid from '@mui/material/Grid2'
import InputLabel from '@mui/material/InputLabel'
import MenuItem from '@mui/material/MenuItem'
import Select from '@mui/material/Select'
import TextField from '@mui/material/TextField'

import Button from '@mui/material/Button'

import type { AppDispatch } from '@store'

// Type Imports
import type { UsersType } from '@/types/apps/userTypes'

import {
  getCountryListManages,
  getCountryListManage,
  getCityListManages,
  getCityListManage,
  getCompanyManage
} from '@store/slices/companySlice'

const TableFilters = ({ setData, tableData, onFilterSubmit }: { setData: (data: UsersType[]) => void; tableData?: UsersType[]; onFilterSubmit?: (filters: any) => void }) => {
  // States
  const dispatch = useDispatch<AppDispatch>()
  const [searchBy, setSearchBy] = useState('0')
  const [country, setCountry] = useState('')
  const [city, setCity] = useState('')
  const [keyword, setKeyword] = useState('')
  const [orderby, setOrder] = useState('country-city')
  const countryList = useSelector(getCountryListManages)
  const cityList = useSelector(getCityListManages)

  const {
    control,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors }
  } = useForm({
    defaultValues: {
      country_id: '',
      searchby: '0',
      city_id: '',
      keyword: '',
      orderby: 'country-city'
    }
  })

  const watchedCountry = watch('country_id')
  const watchedSearchBy = watch('searchby')
   const watchedorderBy = watch('orderby')

  useEffect(() => {
    const params = { sort_by: 'name', sort_order: 'desc' }
    dispatch(getCountryListManage(params))
  }, [dispatch])

  useEffect(() => {
    if (watchedCountry) {
      dispatch(getCityListManage(watchedCountry))
    }
  }, [watchedCountry, dispatch])
  
  console.log(countryList, 'countryList')

  const handleFormSubmit = async (data: any) => {
    console.log('Form submitted with data:', data)
    try {
      const filterParams = {
        searchby: data.searchby,
        country_id: data.country_id || '',
        city_id: data.city_id || '',
        keyword: data.keyword || '',
        order_by: data.orderby,
        sort_by: 'name',
        sort_order: 'desc',
        page: 1,
        per_page: 10
      }
      
      console.log('Filter params being sent:', filterParams)
      
      // Call the parent component's filter handler
      if (onFilterSubmit) {
        await onFilterSubmit(filterParams)
      } else {
        // Fallback: dispatch the filter request directly
        await dispatch(getCompanyManage(filterParams))
      }
      
      // Don't reset form after successful submission to keep selected values
    } catch (error) {
      console.error('Failed to filter companies:', error)
    }
  }

  return (
    <CardContent>
      <form onSubmit={handleSubmit(handleFormSubmit)}>
        <Grid container spacing={5}>
          <Grid size={{ xs: 12, sm: 4 }}>
            <Controller
              name='searchby'
              control={control}
              rules={{ required: true }}
              render={({ field }) => (
                <FormControl fullWidth>
                  <InputLabel id='search-select'>Search By</InputLabel>
                  <Select
                    {...field}
                    fullWidth
                    id='select-role'
                    onChange={e => {
                      field.onChange(e.target.value)
                      setSearchBy(e.target.value)
                      // Reset form fields when search type changes
                      setValue('country_id', '')
                      setValue('city_id', '')
                      setValue('keyword', '')
                      setCountry('')
                      setCity('')
                      setKeyword('')
                    }}
                    label='Search By'
                    labelId='search-select'
                    inputProps={{ placeholder: 'Search By' }}
                  >
                    <MenuItem value='0'>Country</MenuItem>
                    <MenuItem value='1'>Company Name</MenuItem>
                  </Select>
                </FormControl>
              )}
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 4 }}>
            {watchedSearchBy === '0' && (
              <>
                <Controller
                  name='country_id'
                  control={control}
                  render={({ field }) => (
                    <FormControl fullWidth sx={{ mb: 1, p: 1 }}>
                      <InputLabel id='country-select'>Select Country</InputLabel>
                      <Select
                        {...field}
                        fullWidth
                        id='select-country'
                        onChange={e => {
                          field.onChange(e.target.value)
                          setCountry(e.target.value)
                        }}
                        label='Select Country'
                        labelId='country-select'
                      >
                        <MenuItem value=''>Select Country</MenuItem>
                        {countryList?.map((countryItem: any) => (
                          <MenuItem key={countryItem.id} value={countryItem.id}>
                            {countryItem.country_name}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  )}
                />
                <Controller
                  name='city_id'
                  control={control}
                  render={({ field }) => (
                    <FormControl fullWidth sx={{ mb: 1, p: 1 }}>
                      <InputLabel id='city-select'>All Cities</InputLabel>
                      <Select
                        {...field}
                        fullWidth
                        id='select-city'
                        onChange={e => {
                          field.onChange(e.target.value)
                          setCity(e.target.value)
                        }}
                        label='All Cities'
                        labelId='city-select'
                        disabled={!watchedCountry}
                      >
                        <MenuItem value=''>All Cities</MenuItem>
                        {cityList?.map((cityItem: any) => (
                          <MenuItem key={cityItem.id} value={cityItem.id}>
                            {cityItem.city_name}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  )}
                />
              </>
            )}
            <Controller
              name='keyword'
              control={control}
              render={({ field }) => (
                <FormControl fullWidth sx={{ mb: 1, p: 1 }}>
                  <TextField
                    {...field}
                    fullWidth
                    id='keyword-input'
                    label='Keyword'
                    onChange={e => {
                      field.onChange(e.target.value)
                      setKeyword(e.target.value)
                    }}
                    placeholder='Enter company name'
                    variant='outlined'
                  />
                </FormControl>
              )}
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 4 }}>
            <Controller
              name='orderby'
              control={control}
              render={({ field }) => (
                <FormControl fullWidth>
                  <InputLabel id='order-select'>Order By</InputLabel>
                  <Select
                    {...field}
                    fullWidth
                    id='select-order'
                    label='Order By'
                    onChange={e => {
                      field.onChange(e.target.value)
                      setOrder(e.target.value)
                    }}
                    labelId='order-select'
                  >
                    <MenuItem value='country-city'>Country-City</MenuItem>
                    <MenuItem value='company-name'>Company Name</MenuItem>
                  </Select>
                </FormControl>
              )}
            />
          </Grid>
          <Grid size={{ xs: 12 }} sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
            <Button type='submit' variant='contained' sx={{ px: 10 }}>
              Search
            </Button>
          </Grid>
        </Grid>
      </form>
    </CardContent>
  )
}

export default TableFilters
