import express from 'express';
import axios from 'axios';
const app = express();
const port = 3000; // Port for the Loan Agent

// Create multiple lenders
const lender1Port = 3001;
const lender2Port = 3002;

const lender1 = express();
const lender2 = express();

app.use(express.json());
lender1.use(express.json());
lender2.use(express.json());

lender1.post('/createLoanApplication', async (req,res)=> {
    const data = JSON.parse(req.body.data)
    try {
        if(req.body.data) {
            res.sendStatus(200);
        }
    }
    catch(error) {
        res.sendStatus(500);
    }
});

lender2.post('/createLoanApplication', async (req,res)=> {
    const data = JSON.parse(req.body.data)
    try {
        if(req.body.data) {
            res.sendStatus(200);
        }
    }
    catch(error) {
        res.sendStatus(500);
    }
});

app.post('/createLoanApplication', async (req, res) => {
    const applicationData = {
        "metadata": {
          "version": "1.0",
          "originatorOrgId": "your_org_id",
          "originatorParticipantId": "your_participant_id",
          "timestamp": "2023-10-18T12:00:00Z",
          "traceId": "unique_trace_id",
          "requestId": "unique_request_id"
        },
        "productData": {
          "productId": "your_product_id",
          "productNetworkId": "product_network_id"
        },
        "loanApplications": [
          {
            "createdDate": "2023-10-18",
            "loanApplicationId": "unique_loan_app_id",
            "loanApplicationStatus": "CREATED",
            "pledgedDocuments": [
              {
                "source": "GSTN",
                "sourceIdentifier": "gstn_identifier",
                "format": "JSON",
                "reference": "GST_PROFILE",
                "type": "GST_PROFILE",
                "isDataInline": true,
                "data": "base64_encoded_data"
              }
            ],
            "borrower": {
              "primaryId": "borrower_primary_id",
              "primaryIdType": "PAN",
              "additionalIdentifiers": [
                {
                  "key": "additional_key",
                  "value": "additional_value",
                  "url": "additional_url"
                }
              ],
              "name": "Borrower Name",
              "category": "INDIVIDUAL",
              "contactDetails": [
                {
                  "type": "PRIMARY",
                  "phone": "1234567890",
                  "email": "borrower@example.com"
                }
              ],
              "address": {
                "hba": "house_number",
                "srl": "street_name",
                "pinCode": "123456",
                "state": "State",
                "country": "Country"
              },
              "documents": [
                {
                  "source": "PAN",
                  "sourceIdentifier": "pan_identifier",
                  "format": "IMAGE",
                  "reference": "PAN",
                  "type": "PAN",
                  "isDataInline": true,
                  "data": "base64_encoded_data",
                  "url": "document_url"
                }
              ]
            },
            "terms": {
              "requestedAmount": 10000.0,
              "currency": "INR",
              "interestType": "FIXED",
              "interestRate": 10.0,
              "totalRepayableAmount": 12000.0,
              "tenure": {
                "duration": 12,
                "unit": "MONTH"
              },
              "legalAgreement": {
                "type": "TEXT",
                "data": "Legal agreement text"
              }
            }
          }
        ]
      };

    try{
        const options = {
            method: 'POST',
            headers:{
                'Content-type':'application/json'
            },
            data: JSON.stringify(applicationData),
        }

        // Loan Agent -> Lender 1 Create Loan Application request :
        const lender1Url = `http://localhost:${lender1Port}/createLoanApplication`;

        // Loan Agent -> Lender 2 Create Loan Application request :
        const lender2Url = `http://localhost:${lender2Port}/createLoanApplication`;

        // Make API calls to lenders and store responses
        const responseFromLender1 = (await axios.post(lender1Url, options)).status;
        const responseFromLender2 = (await axios.post(lender2Url,options)).status;

        if((responseFromLender1 && responseFromLender2) === 200) {
            res.status(200).json({Success: "Loan Application sent to Multiple lenders", Details: `{${JSON.stringify(applicationData.loanApplications)}, ${JSON.stringify(applicationData.borrower)}, ${JSON.stringify(applicationData.terms)}}`});
        }
        else {
            throw new Error("Failed to send loan application");
        }
    }
    catch(error) {
        console.error('Error in API calls:', error);
        res.status(500).json({ error: 'Failed to create a loan application' });
    };
});

lender1.post('/createLoanResponse', async (req,res)=>{
    const applicationData = JSON.parse(req.body.data);

    // Check whether sufficient data provided or not
    const status = (
        applicationData.metadata &&
        applicationData.productData &&
        applicationData.loanApplications.length > 0 &&
        applicationData.loanApplications[0].loanApplicationStatus === "CREATED" &&
        applicationData.loanApplications[0].borrower &&
        applicationData.loanApplications[0].borrower.primaryId &&
        applicationData.loanApplications[0].borrower.name &&
        applicationData.loanApplications[0].borrower.contactDetails &&
        applicationData.loanApplications[0].borrower.documents &&
        applicationData.loanApplications[0].borrower.address
      ) ? 'PROCESSING' : 'REJECTED';
      res.status(200).json({status});
});

lender2.post('/createLoanResponse', async (req,res)=>{
    const applicationData = JSON.parse(req.body.data);

    // Check whether sufficient data provided or not
    const status = (
        applicationData.metadata &&
        applicationData.productData &&
        applicationData.loanApplications.length > 0 &&
        applicationData.loanApplications[0].loanApplicationStatus === "CREATED" &&
        applicationData.loanApplications[0].borrower &&
        applicationData.loanApplications[0].borrower.primaryId &&
        applicationData.loanApplications[0].borrower.name &&
        applicationData.loanApplications[0].borrower.contactDetails &&
        applicationData.loanApplications[0].borrower.documents &&
        applicationData.loanApplications[0].borrower.address
      ) ? 'PROCESSING' : 'REJECTED';
      res.status(200).json({status});
});


app.post('/createLoanResponse', async (req,res) => {
    const applicationData = {
        "metadata": {
          "version": "1.0",
          "originatorOrgId": "your_org_id",
          "originatorParticipantId": "your_participant_id",
          "timestamp": "2023-10-18T12:00:00Z",
          "traceId": "unique_trace_id",
          "requestId": "unique_request_id"
        },
        "productData": {
          "productId": "your_product_id",
          "productNetworkId": "product_network_id"
        },
        "loanApplications": [
          {
            "createdDate": "2023-10-18",
            "loanApplicationId": "unique_loan_app_id",
            "loanApplicationStatus": "CREATED",
            "pledgedDocuments": [
              {
                "source": "GSTN",
                "sourceIdentifier": "gstn_identifier",
                "format": "JSON",
                "reference": "GST_PROFILE",
                "type": "GST_PROFILE",
                "isDataInline": true,
                "data": "base64_encoded_data"
              }
            ],
            "borrower": {
              "primaryId": "borrower_primary_id",
              "primaryIdType": "PAN",
              "additionalIdentifiers": [
                {
                  "key": "additional_key",
                  "value": "additional_value",
                  "url": "additional_url"
                }
              ],
              "name": "Borrower Name",
              "category": "INDIVIDUAL",
              "contactDetails": [
                {
                  "type": "PRIMARY",
                  "phone": "1234567890",
                  "email": "borrower@example.com"
                }
              ],
              "address": {
                "hba": "house_number",
                "srl": "street_name",
                "pinCode": "123456",
                "state": "State",
                "country": "Country"
              },
              "documents": [
                {
                  "source": "PAN",
                  "sourceIdentifier": "pan_identifier",
                  "format": "IMAGE",
                  "reference": "PAN",
                  "type": "PAN",
                  "isDataInline": true,
                  "data": "base64_encoded_data",
                  "url": "document_url"
                }
              ]
            },
            "terms": {
              "requestedAmount": 10000.0,
              "currency": "INR",
              "interestType": "FIXED",
              "interestRate": 10.0,
              "totalRepayableAmount": 12000.0,
              "tenure": {
                "duration": 12,
                "unit": "MONTH"
              },
              "legalAgreement": {
                "type": "TEXT",
                "data": "Legal agreement text"
              }
            }
          }
        ]
      };

      try{
        const options = {
            headers:{
                'Content-type':'application/json'
            },
            data: JSON.stringify(applicationData),
        }

        // Lender 1 -> Loan Agent Create Loan Application Response
        const response1Url = `http://localhost:${lender1Port}/createLoanResponse`;

        // Lender 2 -> Loan Agent Create Loan Application Response
        const response2Url = `http://localhost:${lender2Port}/createLoanResponse`;

        // Make API calls to lenders and store responses
        const responseFromLender1 = (await axios.post(response1Url, options)).data.status;
        const responseFromLender2 = (await axios.post(response2Url,options)).data.status;
        
        if ((responseFromLender1 && responseFromLender2) === 'PROCESSING'){
            res.status(200).json({Success: "Application is Processing", Details: `{${JSON.stringify(applicationData.loanApplications)}, ${JSON.stringify(applicationData.borrower)}, ${JSON.stringify(applicationData.terms)}}`});
        }
        else if ((responseFromLender1 && responseFromLender2) === 'REJECTED'){
            res.status(201).json({Success: "Application Rejected", Details: `{${JSON.stringify(applicationData.loanApplications)}, ${JSON.stringify(applicationData.borrower)}, ${JSON.stringify(applicationData.terms)}}`});
        }
    }
    catch(error) {
        console.error('Error in API calls:', error);
        res.status(500).json({ error: 'Cannot create Loan Application' });
    };
});

lender1.post('/generateOffersRequest', async (req,res)=> {
    const data = JSON.parse(req.body.data)
    try {
        if(data) {
            res.sendStatus(200);
        }
    }
    catch(error) {
        res.sendStatus(500);
    }
});

lender2.post('/generateOffersRequest', async (req,res)=> {
    const data = JSON.parse(req.body.data)
    try {
        if(data) {
            res.sendStatus(200);
        }
    }
    catch(error) {
        res.sendStatus(500);
    }
});

app.post('/generateOffersRequest', async (req, res) => {
    const requestData = {
        "metadata": {
          "version": "1.0",
          "originatorOrgId": "your_org_id",
          "originatorParticipantId": "your_participant_id",
          "timestamp": "2023-10-18T12:00:00Z",
          "traceId": "unique_trace_id",
          "requestId": "unique_request_id"
        },
        "productData": {
          "productId": "your_product_id",
          "productNetworkId": "product_network_id"
        },
        "loanApplicationIds": ["loan_app_id_1", "loan_app_id_2"]
      };

    try{
        const options = {
            headers:{
                'Content-type':'application/json'
            },
            data: JSON.stringify(requestData),
        }
        // Loan Agent -> Lender 1 Generate Offers Request
        const lender1Url = `http://localhost:${lender1Port}/generateOffersRequest`;

        // Loan Agent -> Lender 2 Generate Offers Request
        const lender2Url = `http://localhost:${lender2Port}/generateOffersRequest`;

        // Make API calls to lenders and store responses
        const responseFromLender1 = (await axios.post(lender1Url, options)).status;
        const responseFromLender2 = (await axios.post(lender2Url,options)).status;

        if((responseFromLender1 && responseFromLender2) === 200) {
            res.status(200).json({Success: "Requested Lenders to Generate Offers",  Details: `${JSON.stringify(requestData.productData)}, ${JSON.stringify(requestData.loanApplicationIds)}`});
        }
        else {
            throw new Error("No new Offers");
        }
    }
    catch(error) {
        console.error('Error in API calls:', error);
        res.status(500).json({ error: 'Failed to Generate Offers' });
    };
});

lender1.post('/generateOffersResponse', async (req,res)=>{
    try {
        const responseData = JSON.parse(req.body.data);
        if(responseData.response.status === "SUCCESS"){
            let offers = [];
            for(let i=0;i<responseData.loanApplications[0].offers.length;i++){
                offers.push({
                    Offer : responseData.loanApplications[0].offers[i],
                })
            }
            res.status(200).send((offers));
        }
        else {
            res.status(201).json({response: "No Offer Generated"});
        }
    }
    catch(error) {
        console.error('Error in API calls:', error);
        res.status(500).json({ error: 'Failed to Generate Offers' });
    }
});

lender2.post('/generateOffersResponse', async (req,res)=>{
    try {
        const responseData = JSON.parse(req.body.data);
        if(responseData.response.status === "SUCCESS"){
            let offers = [];
            for(let i=0;i<responseData.loanApplications[0].offers.length;i++){
                offers.push({
                    Offer :responseData.loanApplications[0].offers[i],
                })
            }
            res.status(200).send((offers));
        }
        else {
            res.status(201).json({response: "No Offer Generated"});
        }
    }
    catch(error) {
        console.error('Error in API calls:', error);
        res.status(500).json({ error: 'Failed to Generate Offers' });
    }
});

app.post('/generateOffersResponse', async (req,res) => {
    const responseData = {
        "metadata": {
          "version": "1.0",
          "originatorOrgId": "your_org_id",
          "originatorParticipantId": "your_participant_id",
          "timestamp": "2023-10-18T12:00:00Z",
          "traceId": "unique_trace_id",
          "requestId": "unique_request_id"
        },
        "response": {
          "status": "SUCCESS",
          "responseDetail": "Request received successfully."
        },
        "productData": {
          "productId": "your_product_id",
          "productNetworkId": "product_network_id"
        },
        "loanApplications": [
          {
            "createdDate": "2023-10-18",
            "loanApplicationId": "unique_loan_app_id",
            "loanApplicationStatus": "CREATED",
            "kyc": {
              "kycRefNo": "kyc_reference_number",
              "description": "KYC description",
              "business": {
                "type": "CKYC",
                "scale": "MICRO",
                "category": "SERVICE",
                "name": "Business Name",
                "address": {
                  "hba": "house_number",
                  "srl": "street_name",
                  "pinCode": "123456",
                  "state": "State",
                  "country": "Country",
                  "url": "business_address_url"
                },
                "email": "business@example.com",
                "phoneNumber": "1234567890",
                "incorporationDate": "2023-10-18",
                "commencementDate": "2023-10-18",
                "udyam": {
                  "registrationNumber": "udyam_registration_number",
                  "registrationDate": "2023-10-18"
                },
                "status": "SUCCESS"
              }
            },
            "individual": {
              "type": "CKYC",
              "name": "Borrower Name",
              "dob": "1990-01-01",
              "address": {
                "hba": "house_number",
                "srl": "street_name",
                "pinCode": "123456",
                "state": "State",
                "country": "Country",
                "url": "individual_address_url"
              },
              "email": "borrower@example.com",
              "phoneNumber": "1234567890",
              "status": "SUCCESS"
            },
            "offers": [
              {
                "id": "offer_id_1",
                "validTill": "2023-09-21",
                "terms": {
                  "requestedAmount": 10000.0,
                  "currency": "INR",
                  "interestType": "FIXED",
                  "interestRate": 10.0,
                  "coolingOffPeriod": {
                    "duration": 12,
                    "unit": "MONTH"
                  },
                  "totalRepayableAmount": 12000.0,
                  "description": "Offer description",
                  "tenure": {
                    "duration": 12,
                    "unit": "MONTH"
                  },
                  "legalAgreement": {
                    "type": "TEXT",
                    "data": "Legal agreement text"
                  },
                  "documents": [
                    {
                      "source": "GSTN",
                      "sourceIdentifier": "gstn_identifier",
                      "format": "JSON",
                      "reference": "GST_PROFILE",
                      "type": "GST_PROFILE",
                      "isDataInline": true,
                      "data": "base64_encoded_data",
                      "url": "document_url"
                    }
                  ],
                  "charges": {
                    "prepayment": {
                      "chargeType": "FIXED_AMOUNT",
                      "data": {
                        "rate": 0,
                        "amount": 0,
                        "applicableParameter": "TOTAL_LOAN_AMOUNT",
                        "description": "Prepayment charge"
                      },
                      "url": "prepayment_url"
                    },
                    "bounce": {
                      "chargeType": "FIXED_AMOUNT",
                      "data": {
                        "rate": 0,
                        "amount": 0,
                        "applicableParameter": "TOTAL_LOAN_AMOUNT",
                        "description": "Bounce charge"
                      },
                      "url": "bounce_url"
                    },
                    "latePayment": {
                      "chargeType": "FIXED_AMOUNT",
                      "data": {
                        "rate": 0,
                        "amount": 0,
                        "applicableParameter": "TOTAL_LOAN_AMOUNT",
                        "description": "Late payment charge"
                      },
                      "url": "late_payment_url"
                    },
                    "processing": {
                      "chargeType": "FIXED_AMOUNT",
                      "data": {
                        "rate": 0,
                        "amount": 0,
                        "applicableParameter": "TOTAL_LOAN_AMOUNT",
                        "description": "Processing charge"
                      },
                      "url": "processing_url"
                    },
                    "other": {
                      "chargeType": "FIXED_AMOUNT",
                      "data": {
                        "rate": 0,
                        "amount": 0,
                        "applicableParameter": "TOTAL_LOAN_AMOUNT",
                        "description": "Other charge"
                      },
                      "url": "other_charge_url"
                    }
                  },
                  "url": "offer_url"
                },
                "disbursement": {
                  "plans": [
                    {
                      "id": "disbursement_plan_id",
                      "title": "Disbursement Plan Title",
                      "shortDescription": "Short description",
                      "description": "Description",
                      "paymentUrl": "disbursement_payment_url",
                      "payNowAllowed": true,
                      "editPlanAllowed": true,
                      "changeMethodAllowed": true,
                      "automatic": true,
                      "scheduleType": "RECURRING",
                      "noOfInstallment": 0,
                      "frequency": "MONTHLY",
                      "tenure": {
                        "duration": 0,
                        "unit": "MONTH"
                      },
                      "totalAmount": 0,
                      "principal": 0,
                      "interestAmount": 0,
                      "penalty": 0,
                      "startDate": "2023-09-21",
                      "status": "ACTIVE",
                      "url": "disbursement_plan_url"
                    }
                  ],
                  "accountDetails": [
                    {
                      "id": "account_details_id",
                      "description": "Account details description",
                      "status": "ACTIVE",
                      "accountDataType": "ACCOUNT",
                      "data": {
                        "accountType": "CURRENT",
                        "accountIFSC": "account_ifsc",
                        "accountNumber": "account_number",
                        "vpa": "account_vpa",
                        "maskedAccountNumber": "masked_account_number",
                        "accountHolderName": "account_holder_name",
                        "url": "account_details_url"
                      }
                    }
                  ]
                },
                "repayment": {
                  "plans": [
                    {
                      "id": "repayment_plan_id",
                      "title": "Repayment Plan Title",
                      "shortDescription": "Short description",
                      "description": "Description",
                      "paymentUrl": "repayment_payment_url",
                      "payNowAllowed": true,
                      "editPlanAllowed": true,
                      "changeMethodAllowed": true,
                      "automatic": true,
                      "scheduleType": "RECURRING",
                      "noOfInstallment": 0,
                      "frequency": "MONTHLY",
                      "tenure": {
                        "duration": 0,
                        "unit": "MONTH"
                      },
                      "totalAmount": 0,
                      "principal": 0,
                      "interestAmount": 0,
                      "penalty": 0,
                      "startDate": "2023-09-21",
                      "status": "ACTIVE",
                      "url": "repayment_plan_url"
                    }
                  ]
                }
              }
            ],
            "description": "Loan application description",
            "url": "loan_application_url",
            "extensibleData": {
              "key1": "value1",
              "key2": "value2"
            }
          }
        ],
        "rejectionDetails": [
          {
            "reason": "LOW_CREDIT_SCORE",
            "description": "Low credit score reason",
            "url": "rejection_reason_url"
          }
        ],
        "actionRequired": [
          {
            "actionType": "ADD_DOCUMENT",
            "description": "Add document action",
            "reference": {
              "object": "OBJECT_TYPE",
              "value": "OBJECT_VALUE"
            },
            "url": "action_required_url"
          }
        ]
      };

      try{
        const options = {
            headers:{
                'Content-type':'application/json'
            },
            data: JSON.stringify(responseData),
        }
        // Lender 1 -> Loan Agent Generate Offers Response
        const response1Url = `http://localhost:${lender1Port}/generateOffersResponse`;

        // Lender 2 -> Loan Agent Generate Offers Response
        const response2Url = `http://localhost:${lender2Port}/generateOffersResponse`;

        // Make API calls to lenders and store responses
        const responseFromLender1 = (await axios.post(response1Url, options)).data[0];
        const responseFromLender2 = (await axios.post(response2Url,options)).data[0];
        
        if (responseFromLender1 || responseFromLender2) {
            res.status(200).json({Success: "Offers Generated", Details: `${JSON.stringify(responseFromLender1)}, ${JSON.stringify(responseFromLender2)}`});
        }
        else {
            res.status(201).json({Success: "No relevant offers", Details: `${JSON.stringify(responseFromLender1)}, ${JSON.stringify(responseFromLender2)}`});
        }
    }
    catch(error) {
        console.error('Error in API calls:', error);
        res.status(500).json({ error: 'Error generating offers. Try again' });
    };
});

lender1.post('/setOffersRequest', async (req,res)=> {
    const data = JSON.parse(req.body.data)
    try {
        if(data) {
            res.sendStatus(200);
        }
    }
    catch(error) {
        res.sendStatus(500);
    }
});

lender2.post('/setOffersRequest', async (req,res)=> {
    const data = JSON.parse(req.body.data)
    try {
        if(data) {
            res.sendStatus(200);
        }
    }
    catch(error) {
        res.sendStatus(500);
    }
});

app.post('/setOffersRequest', async (req, res) => {
    const offerData = {
        "metadata": {
          "version": "1.0",
          "originatorOrgId": "your_org_id",
          "originatorParticipantId": "your_participant_id",
          "timestamp": "2023-10-18T12:00:00Z",
          "traceId": "unique_trace_id",
          "requestId": "unique_request_id"
        },
        "productData": {
          "productId": "your_product_id",
          "productNetworkId": "product_network_id"
        },
        "loanApplicationId": "unique_loan_app_id",
        "offer": {
          "id": "offer_id_1",
          "validTill": "2023-09-21",
          "terms": {
            "requestedAmount": 10000.0,
            "currency": "INR",
            "sanctionedAmount": 9500.0,
            "netDisbursedAmount": 9500.0,
            "interestType": "FIXED",
            "interestRate": 10.0,
            "annualPercentageRate": 12.0,
            "coolingOffPeriod": {
              "duration": 12,
              "unit": "MONTH"
            },
            "totalRepayableAmount": 12000.0,
            "interestAmount": 2000.0,
            "description": "Offer description",
            "tenure": {
              "duration": 12,
              "unit": "MONTH"
            },
            "legalAgreement": {
              "type": "TEXT",
              "data": "Legal agreement text"
            },
            "documents": [
              {
                "source": "GSTN",
                "sourceIdentifier": "gstn_identifier",
                "format": "JSON",
                "reference": "GST_PROFILE",
                "type": "GST_PROFILE",
                "isDataInline": true,
                "data": "base64_encoded_data",
                "url": "document_url"
              }
            ],
            "charges": {
              "prepayment": {
                "chargeType": "FIXED_AMOUNT",
                "data": {
                  "rate": 0,
                  "amount": 0,
                  "applicableParameter": "TOTAL_LOAN_AMOUNT",
                  "description": "Prepayment charge"
                },
                "url": "prepayment_url"
              },
              "bounce": {
                "chargeType": "FIXED_AMOUNT",
                "data": {
                  "rate": 0,
                  "amount": 0,
                  "applicableParameter": "TOTAL_LOAN_AMOUNT",
                  "description": "Bounce charge"
                },
                "url": "bounce_url"
              },
              "latePayment": {
                "chargeType": "FIXED_AMOUNT",
                "data": {
                  "rate": 0,
                  "amount": 0,
                  "applicableParameter": "TOTAL_LOAN_AMOUNT",
                  "description": "Late payment charge"
                },
                "url": "late_payment_url"
              },
              "processing": {
                "chargeType": "FIXED_AMOUNT",
                "data": {
                  "rate": 0,
                  "amount": 0,
                  "applicableParameter": "TOTAL_LOAN_AMOUNT",
                  "description": "Processing charge"
                },
                "url": "processing_url"
              },
              "other": {
                "chargeType": "FIXED_AMOUNT",
                "data": {
                  "rate": 0,
                  "amount": 0,
                  "applicableParameter": "TOTAL_LOAN_AMOUNT",
                  "description": "Other charge"
                },
                "url": "other_charge_url"
              }
            },
            "url": "offer_url"
          },
          "disbursement": {
            "plans": [
              {
                "id": "disbursement_plan_id",
                "title": "Disbursement Plan Title",
                "shortDescription": "Short description",
                "description": "Description",
                "paymentUrl": "disbursement_payment_url",
                "payNowAllowed": true,
                "editPlanAllowed": true,
                "changeMethodAllowed": true,
                "automatic": true,
                "scheduleType": "RECURRING",
                "noOfInstallment": 0,
                "frequency": "MONTHLY",
                "tenure": {
                  "duration": 0,
                  "unit": "MONTH"
                },
                "totalAmount": 0,
                "principal": 0,
                "interestAmount": 0,
                "penalty": 0,
                "startDate": "2023-09-21",
                "status": "ACTIVE",
                "url": "disbursement_plan_url"
              }
            ],
            "accountDetails": [
              {
                "id": "account_details_id",
                "description": "Account details description",
                "status": "ACTIVE",
                "accountDataType": "ACCOUNT",
                "data": {
                  "accountType": "CURRENT",
                  "accountIFSC": "account_ifsc",
                  "accountNumber": "account_number",
                  "vpa": "account_vpa",
                  "maskedAccountNumber": "masked_account_number",
                  "accountHolderName": "account_holder_name",
                  "url": "account_details_url"
                }
              }
            ]
          },
          "repayment": {
            "plans": [
              {
                "id": "repayment_plan_id",
                "title": "Repayment Plan Title",
                "shortDescription": "Short description",
                "description": "Description",
                "paymentUrl": "repayment_payment_url",
                "payNowAllowed": true,
                "editPlanAllowed": true,
                "changeMethodAllowed": true,
                "automatic": true,
                "scheduleType": "RECURRING",
                "noOfInstallment": 0,
                "frequency": "MONTHLY",
                "tenure": {
                  "duration": 0,
                  "unit": "MONTH"
                },
                "totalAmount": 0,
                "principal": 0,
                "interestAmount": 0,
                "penalty": 0,
                "startDate": "2023-09-21",
                "status": "ACTIVE",
                "url": "repayment_plan_url"
              }
            ]
          }
        }
      };

    try{
        const options = {
            headers:{
                'Content-type':'application/json'
            },
            data: JSON.stringify(offerData),
        }
        // Loan Agent -> Lenders whose offer has been chosen(Here both). Set Offers Request
        const lender1Url = `http://localhost:${lender1Port}/setOffersRequest`;

        // Loan Agent -> Lenders whose offer has been chosen(Here both). Set Offers Request
        const lender2Url = `http://localhost:${lender2Port}/setOffersRequest`;

        // Make API calls to lenders and store responses
        const responseFromLender1 = (await axios.post(lender1Url, options)).status;
        const responseFromLender2 = (await axios.post(lender2Url,options)).status;

        if((responseFromLender1 && responseFromLender2) === 200) {
            res.status(200).json({Success: "Requested Lender to set the Offer",  Details: `${JSON.stringify(offerData.productData)}, ${JSON.stringify(offerData.loanApplicationId)},  ${JSON.stringify(offerData.offer)}`});
        }
        else {
            throw new Error("Request failed");
        }
    }
    catch(error) {
        console.error('Error in API calls:', error);
        res.status(500).json({ error: 'Offer request failed' });
    };
});

lender1.post('/setOffersResponse', async (req,res)=>{
    try {
        const offerData = JSON.parse(req.body.data);
        if(offerData.response.status === "SUCCESS"){
            res.status(200).json({Success: "Loan Offered",  Details: `${JSON.stringify(offerData.productData)}, ${JSON.stringify(offerData.loanApplicationId)},  ${JSON.stringify(offerData.loanApplicationStatus)}`});
        }
        else {
            res.status(201).json({response: "Loan not offered"});
        }
    }
    catch(error) {
        console.error('Error in API calls:', error);
        res.status(500).json({ error: 'Failed to set offers' });
    }
});

lender2.post('/setOffersResponse', async (req,res)=>{
    try {
        const offerData = JSON.parse(req.body.data);
        if(offerData.response.status === "SUCCESS"){
            res.status(200).json({Success: "Loan Offered",  Details: `${JSON.stringify(offerData.productData)}, ${JSON.stringify(offerData.loanApplicationId)},  ${JSON.stringify(offerData.loanApplicationStatus)}`});
        }
        else {
            res.status(201).json({response: "Loan not offered"});
        }
    }
    catch(error) {
        console.error('Error in API calls:', error);
        res.status(500).json({ error: 'Failed to set offers' });
    }
});

app.post('/setOffersResponse', async (req,res) => {
    const offerData = {
        "metadata": {
          "version": "1.0",
          "originatorOrgId": "your_org_id",
          "originatorParticipantId": "your_participant_id",
          "timestamp": "2023-10-18T14:30:00Z",
          "traceId": "unique_trace_id",
          "requestId": "unique_request_id"
        },
        "response": {
          "status": "SUCCESS",
          "responseDetail": "Response details (optional)"
        },
        "productData": {
          "productId": "your_product_id",
          "productNetworkId": "product_network_id"
        },
        "loanApplicationId": "unique_loan_app_id",
        "loanApplicationStatus": "OFFERED",
        "extensibleData": {
          "additionalKey": "additional_value",
          "anotherKey": "another_value"
        }
      };

      try{
        const options = {
            headers:{
                'Content-type':'application/json'
            },
            data: JSON.stringify(offerData),
        }

        // Lender whose offer chosen (Here both) -> Loan Agent SetOffer Response.
        const response1Url = `http://localhost:${lender1Port}/setOffersResponse`;

        // Lender whose offer chosen (Here both) -> Loan Agent SetOffer Response.
        const response2Url = `http://localhost:${lender2Port}/setOffersResponse`;

        // Make API calls to lenders and store responses
        const responseFromLender1 = (await axios.post(response1Url, options)).data;
        const responseFromLender2 = (await axios.post(response2Url,options)).data;
        
        console.log(responseFromLender1, responseFromLender2)
        if (responseFromLender1 || responseFromLender2) {
            res.status(200).json({Success: "Loan Offered", Details: `${JSON.stringify(responseFromLender1)}, ${JSON.stringify(responseFromLender2)}`});
        }
        else {
            res.status(201).json({Success: "No relevant offers to set", Details: `${JSON.stringify(responseFromLender1)}, ${JSON.stringify(responseFromLender2)}`});
        }
    }
    catch(error) {
        console.error('Error in API calls:', error);
        res.status(500).json({ error: 'Error setting offers. Try again' });
    };
});


// Start the Loan Agent server
app.listen(port, () => {
    console.log(`Loan Agent is listening on port ${port}`);
});

// Start lender servers
lender1.listen(lender1Port, () => {
    console.log(`Lender 1 is listening on port ${lender1Port}`);
});

lender2.listen(lender2Port, () => {
    console.log(`Lender 2 is listening on port ${lender2Port}`);
});
