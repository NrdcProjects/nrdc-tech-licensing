import { AppBar, Box, Button, Card, CardContent, CardHeader, Divider, FormControl, FormHelperText, Grid, InputAdornment, InputLabel, OutlinedInput, Typography } from "@mui/material";
import { useState } from "react";
import { lumpsumFormConfig, royaltyFormConfig } from '../config'

const calculatePercentage = (a, b) => (a / 100) * b;
const getPercent = (val) => NaN !== 100 - Number.parseInt(val) ? 100 - Number.parseInt(val) : ''

export default function Docs() {
  const [lumpSumFormData, setLumpSumFormData] = useState({ lumpsumPercentageDev: 70, lumpsumPercentage: 30, gstPercentageDev: 70, gstPercentage: 30, gstRate: 12 })
  const [royaltyFormData, setRoyaltyFormData] = useState({ royaltyPercentageDev: 95, royaltyPercentage: 5 })
  const [showResult, setShowResult] = useState({ lumpsumResult: false, royaltyResult: false })
  const [formSubmitted, setFormSubmitted] = useState({ lumpsum: false, royalty: false })

  const onLumpsumFieldValueChange = (e) => {
    const value = !isNaN(e.target.value) ? e.target.value : false
    setLumpSumFormData((prevState) => ({ ...prevState, [e.target.name]: value ? value : prevState[e.target.name] }))
    resetConfig(lumpsumFormConfig,'lumpsumResult')
  }

  const resetConfig = (config, showResultKey) => {
    config.forEach((item) => {
       item.result = ''
      }
    )
    setShowResult((prevState) => ({ ...prevState, [showResultKey]: false }))
  }

  const calculateResult = (config, data, showResultKey) => {
    let show = true
    config.forEach((item) => {
      if (!!!data[item.sourceField]) {
        show = false
      } else {
        const value = calculatePercentage(Number.parseInt(data[item.percentageField]), data[item.sourceField])
        item.result = currencyFomatting(value)
      }
    })
    setShowResult((prevState) => ({ ...prevState, [showResultKey]: show }))
  }

  const validateLumpSumForm = (field) => {
    return formSubmitted.lumpsum && !!!lumpSumFormData[field]
  }

  const validateRoyaltyForm = (field) => {
    return formSubmitted.royalty && !!!royaltyFormData[field]
  }

  const ErrorMessage = ({ id, validate }) => {
    return validate(id) ?
      <FormHelperText error id="accountId-error">
        Required Field
      </FormHelperText> : null
  }

  const currencyFomatting = (value) => {
    const __amount = value?.toString().replace(/,/g, '').replace(/[a-z]/g, '').replace(/[;?,'`=-\\\/]/g,'')
    return value ? new Intl.NumberFormat("en-IN").format(__amount): '';
  }

  return (
    <>
      <AppBar sx={{ mb: 2 }} position="static">
        <Typography
          variant="h4"
          noWrap
          component="div"
          sx={{
            pl: 2,
            display: { xs: 'none', md: 'flex' },
            fontFamily: 'monospace',
            fontWeight: 700,
            letterSpacing: '.2rem',
            color: 'inherit',
            textDecoration: 'none',
          }}
        >
          NRDC Licencing
        </Typography>
      </AppBar>
      <Grid container spacing={2}>
        <Grid item xs={7}>
          <Card variant="outlined" sx={{ minHeight: '456px' }}>
            <CardHeader title={`Calculate R&D Share of Lumpsum Premium`} />
            <CardContent>
              <form onSubmit={(e) => {
                e.preventDefault();
                setFormSubmitted((prevState) => ({ ...prevState, lumpsum: true }))
                calculateResult(lumpsumFormConfig, lumpSumFormData, 'lumpsumResult')
              }}>
                <FormControl sx={{ m: 1, width: '870px' }}>
                  <InputLabel htmlFor="developer" sx={{fontSize: 18, fontWeight: 600, color: '#000'}}>{`R&D Institution`}</InputLabel>
                  <OutlinedInput
                    sx={{fontSize: 19}}
                    id="developer"
                    name="developer"
                    label={`R&D Institution`}
                    value={lumpSumFormData.developer}
                    error={validateLumpSumForm("developer")}
                    onChange={(e) => {
                      setLumpSumFormData((prevState) => ({ ...prevState, [e.target.name]: e.target.value})) 
                      resetConfig(lumpsumFormConfig, 'lumpsumResult')
                    }}
                  />
                  <ErrorMessage id="developer" validate={validateLumpSumForm} />
                </FormControl>
                <div>
                  <FormControl sx={{ m: 1, width: '280px' }}>
                    <InputLabel htmlFor="lumpsum" sx={{fontSize: 18, fontWeight: 600, color: '#000'}}>Lum Sum Amount</InputLabel>
                    <OutlinedInput
                      sx={{fontSize: 19}}
                      id="lumpsum"
                      name="lumpsum"
                      label='Lum Sum Amount'
                      startAdornment={<> &#x20B9;</>}
                      error={validateLumpSumForm("lumpsum")}
                      value={currencyFomatting(lumpSumFormData?.lumpsum)}
                      onChange={(e) => {
                        const _val = e.target.value.toString().replace(/,/g, '')
                        const val = !isNaN(_val) ? _val : lumpSumFormData.lumpsum1
                        setLumpSumFormData((prevState) => ({
                          ...prevState, lumpsum1: val, lumpsum: e.target.value,
                          gstAmount1: calculatePercentage(Number.parseInt(lumpSumFormData.gstRate), val),
                          gstAmount: currencyFomatting(calculatePercentage(Number.parseInt(lumpSumFormData.gstRate), val))
                        }))
                        resetConfig(lumpsumFormConfig,'lumpsumResult')
                      }} />

                    <ErrorMessage id="lumpsum" validate={validateLumpSumForm} />
                  </FormControl>
                  <FormControl sx={{ m: 1, width: '280px' }}>
                    <InputLabel htmlFor="lumpsumPercentageDev" sx={{fontSize: 18, fontWeight: 600, color: '#000'}}>{`Lump Sum Percentage(R&D Institution)`}</InputLabel>
                    <OutlinedInput
                      sx={{fontSize: 19}}
                      id="lumpsumPercentageDev"
                      name="lumpsumPercentageDev"
                      label={`Lump Sum Percentage(R&D Institution)`}
                      defaultValue={70}
                      value={lumpSumFormData.lumpsumPercentageDev}
                      endAdornment={'%'}
                      type="number"
                      error={validateLumpSumForm("lumpsumPercentageDev")}
                      onChange={(e) => {
                        const val = e.target.value
                        setLumpSumFormData((prevState) => ({
                          ...prevState, lumpsumPercentageDev: val,
                          lumpsumPercentage: getPercent(val)
                        }))
                        resetConfig(lumpsumFormConfig,'lumpsumResult')
                      }}
                    />
                    <ErrorMessage id="lumpsumPercentageDev" validate={validateLumpSumForm} />
                  </FormControl>
                  <FormControl sx={{ m: 1, width: '280px' }}>
                    <InputLabel htmlFor="lumpsumPercentage" sx={{fontSize: 18, fontWeight: 600, color: '#000'}}>Lum Sum Percentage(NRDC)</InputLabel>
                    <OutlinedInput
                      sx={{fontSize: 19}}
                      id="lumpsumPercentage"
                      name="lumpsumPercentage"
                      label="Lum Sum Percentage(NRDC)"
                      defaultValue={30}
                      value={lumpSumFormData.lumpsumPercentage}
                      endAdornment={'%'}
                      type="number"
                      error={validateLumpSumForm("lumpsumPercentage")}
                      onChange={(e) => {
                        const val = e.target.value
                        setLumpSumFormData((prevState) => ({
                          ...prevState, lumpsumPercentage: val,
                          lumpsumPercentageDev: getPercent(val)
                        }))
                        resetConfig(lumpsumFormConfig,'lumpsumResult')
                      }}
                    />
                    <ErrorMessage id="lumpsumPercentage" validate={validateLumpSumForm} />
                  </FormControl>
                </div>
                <div>
                  <FormControl sx={{ m: 1, width: '280px' }}>
                    <InputLabel htmlFor="gstAmount" sx={{fontSize: 18, fontWeight: 600, color: '#000'}}>GST Amount</InputLabel>
                    <OutlinedInput
                      sx={{fontSize: 19}}
                      id="gstAmount"
                      name="gstAmount"
                      label="GST Amount"
                      startAdornment={<> &#x20B9;</>}
                      value={lumpSumFormData.gstAmount}
                      error={validateLumpSumForm("gstAmount")}
                      onChange={onLumpsumFieldValueChange}
                    />
                    <ErrorMessage id="gstAmount" validate={validateLumpSumForm} />
                  </FormControl>
                  <FormControl sx={{ m: 1, width: '280px' }}>
                    <InputLabel htmlFor="gstPercentage" sx={{fontSize: 18, fontWeight: 600, color: '#000'}}>{`GST Percentage(R&D Institution)`}</InputLabel>
                    <OutlinedInput
                      sx={{fontSize: 19}}
                      id="gstPercentageDev"
                      name="gstPercentageDev"
                      defaultValue={70}
                      value={lumpSumFormData.gstPercentageDev}
                      endAdornment={<InputAdornment position="end">%</InputAdornment>}
                      label={`GST Percentage(R&D Institution)`}
                      error={validateLumpSumForm("gstPercentageDev")}
                      onChange={(e) => {
                        const val = e.target.value
                        setLumpSumFormData((prevState) => ({
                          ...prevState, gstPercentageDev: val,
                          gstPercentage: getPercent(val)
                        }))
                        resetConfig(lumpsumFormConfig,'lumpsumResult')
                      }}
                    />
                    <ErrorMessage id="gstPercentageDev" validate={validateLumpSumForm} />
                  </FormControl>
                  <FormControl sx={{ m: 1, width: '280px' }}>
                    <InputLabel htmlFor="gstPercentage" sx={{fontSize: 18, fontWeight: 600, color: '#000'}}>GST Percentage(NRDC)</InputLabel>
                    <OutlinedInput
                      sx={{fontSize: 19}}
                      id="gstPercentage"
                      name="gstPercentage"
                      defaultValue={30}
                      value={lumpSumFormData.gstPercentage}
                      endAdornment={<InputAdornment position="end">%</InputAdornment>}
                      label="GST Percentage(NRDC)"
                      type="number"
                      error={validateLumpSumForm("gstPercentage")}
                      onChange={(e) => {
                        const val = e.target.value
                        setLumpSumFormData((prevState) => ({
                          ...prevState, gstPercentage: val,
                          gstPercentageDev: getPercent(val)
                        }))
                        resetConfig(lumpsumFormConfig,'lumpsumResult')
                      }}
                    />
                    <ErrorMessage id="gstPercentage" validate={validateLumpSumForm} />
                  </FormControl>
                  <FormControl sx={{ m: 1, width: '280px' }}>
                    <InputLabel htmlFor="gstRate" sx={{fontSize: 18, fontWeight: 600, color: '#000'}}>Current GST Rate</InputLabel>
                    <OutlinedInput
                      sx={{fontSize: 19}}
                      id="gstRate"
                      name="gstRate"
                      defaultValue={12}
                      endAdornment={<InputAdornment position="end">%</InputAdornment>}
                      label="Current GST Rate"
                      type="number"
                      error={validateLumpSumForm("gstRate")}
                      onChange={(e) => {
                          const _val = e.target.value
                          const val = !isNaN(_val) ? _val : lumpSumFormData.gstRate1
                          setLumpSumFormData((prevState) => ({
                            ...prevState, gstRate: val,
                            gstAmount1: calculatePercentage(Number.parseInt(val), prevState.lumpsum1),
                            gstAmount: currencyFomatting(calculatePercentage(Number.parseInt(val), prevState.lumpsum1))
                          }))
                          resetConfig(lumpsumFormConfig,'lumpsumResult')
                      }}
                    />
                    <ErrorMessage id="gstRate" validate={validateLumpSumForm} />
                  </FormControl>
                </div>
                <Button variant='contained' type="submit" style={{ marginLeft: '10px', marginTop: '10px', fontWeight: 600 }}>
                  Calculate
                </Button>
              </form>
            </CardContent>
            {showResult.lumpsumResult ? <Box sx={{ marginLeft: '10px' }}>
              <Divider />
              <CardContent>
                <Grid container spacing={{ xs: 2, md: 3 }} columns={{ xs: 4, sm: 8, md: 12 }}>
                  {lumpsumFormConfig.map((item, index) => (
                    <Grid item xs={2} sm={4} md={6} key={index}>
                      <Typography sx={{ fontSize: 14, fontWeight: 600 }} color="text.secondary" gutterBottom>
                        {item.fieldTitle}
                      </Typography><Typography variant="h5" component="div">
                        &#x20B9;{item.result}
                      </Typography>
                    </Grid>
                  )
                  )}
                </Grid>
              </CardContent></Box> : null}
          </Card>
        </Grid>
        <Grid item xs={5}>
          <Card variant="outlined" sx={{ minHeight: '456px' }}>
            <CardHeader title={`Calculate R&D Share of Recurring Royalty`} />
            <CardContent>
              <form onSubmit={(e) => {
                e.preventDefault();
                setFormSubmitted((prevState) => ({ ...prevState, royalty: true }))
                calculateResult(royaltyFormConfig, royaltyFormData, 'royaltyResult')
              }}>
                <FormControl sx={{ m: 1, width: '280px' }}>
                  <InputLabel htmlFor="sale" sx={{fontSize: 18, fontWeight: 600, color: '#000'}}>Sale Amount</InputLabel>
                  <OutlinedInput
                    sx={{fontSize: 19}}
                    id="sale"
                    name="sale"
                    label="Sale Amount"
                    startAdornment={<> &#x20B9;</>}
                    error={validateRoyaltyForm("sale")}
                    value={currencyFomatting(royaltyFormData.sale)}
                    onChange={(e) => {
                      const val = e.target.value.toString().replace(/,/g, '')
                      setRoyaltyFormData((prevState) => ({ ...prevState, [e.target.name]: e.target.value, sale1: val }))
                      resetConfig(royaltyFormConfig,'royaltyResult')
                    }}
                  />
                  <ErrorMessage id="sale" validate={validateRoyaltyForm} />
                </FormControl>
                <div>
                  <FormControl sx={{ m: 1, width: '280px' }}>
                    <InputLabel htmlFor="royaltyPercentageDev" sx={{fontSize: 18, fontWeight: 600, color: '#000'}}>{`Royalty Percentage(R&D Institution)`}</InputLabel>
                    <OutlinedInput
                      sx={{fontSize: 19}}
                      id="royaltyPercentageDev"
                      name="royaltyPercentageDev"
                      label={`Royalty Percentage(R&D Institution)`}
                      defaultValue={95}
                      value={royaltyFormData.royaltyPercentageDev}
                      endAdornment={'%'}
                      type="number"
                      error={validateRoyaltyForm("royaltyPercentageDev")}
                      onChange={(e) => {
                        const val = e.target.value
                        setRoyaltyFormData((prevState) => ({
                          ...prevState, royaltyPercentageDev: val,
                          royaltyPercentage: getPercent(val)
                        }))
                        resetConfig(royaltyFormConfig,'royaltyResult')
                      }}
                    />
                    <ErrorMessage id="royaltyPercentageDev" validate={validateRoyaltyForm} />
                  </FormControl>
                  <FormControl sx={{ m: 1, width: '280px' }}>
                    <InputLabel htmlFor="royaltyPercentage" sx={{fontSize: 18, fontWeight: 600, color: '#000'}}>Royalty Percentage(NRDC)</InputLabel>
                    <OutlinedInput
                      sx={{fontSize: 19}}
                      id="royaltyPercentage"
                      name="royaltyPercentage"
                      label="Royalty Percentage(NRDC)"
                      defaultValue={5}
                      value={royaltyFormData.royaltyPercentage}
                      endAdornment={'%'}
                      error={validateRoyaltyForm("royaltyPercentage")}
                      onChange={(e) => {
                        const val = e.target.value
                        setRoyaltyFormData((prevState) => ({
                          ...prevState, royaltyPercentage: val,
                          royaltyPercentageDev: getPercent(val)
                        }))
                        resetConfig(royaltyFormConfig,'royaltyResult')
                      }}
                    />
                    <ErrorMessage id="royaltyPercentage" validate={validateRoyaltyForm} />
                  </FormControl>
                </div>
                <Button variant='contained' type="submit" style={{ marginLeft: '10px', marginTop: '155px', fontWeight: 600 }}>
                  Calculate
                </Button>
              </form>
            </CardContent>
            {showResult.royaltyResult ? <>
              <Divider />
              <CardContent>
                <Grid container spacing={{ xs: 2, md: 3 }} columns={{ xs: 4, sm: 8, md: 12 }}>
                  {royaltyFormConfig.map((item, index) => (
                    <Grid item xs={2} sm={4} md={6} key={index}>
                      <Typography sx={{ fontSize: 14, fontWeight: 600 }} color="text.secondary" gutterBottom>
                        {item.fieldTitle}
                      </Typography><Typography variant="h5" component="div">
                        &#x20B9;{item.result}
                      </Typography>
                    </Grid>
                  )
                  )}
                </Grid>
              </CardContent></> : null}
          </Card>
        </Grid>
      </Grid>
    </>
  );
}
