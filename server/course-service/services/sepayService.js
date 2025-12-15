const axios = require('axios')

// Try to load SePay SDK, fallback to manual API if not available
let SePayPgClient = null
try {
    SePayPgClient = require('sepay-pg-node').SePayPgClient
    console.log('✅ SePay SDK loaded successfully')
} catch (error) {
    console.log('⚠️ SePay SDK not found, using manual API calls')
    console.log('   Install with: npm install sepay-pg-node')
}

/**
 * SePay Service - Xử lý tích hợp thanh toán SePay
 * 
 * SePay API Documentation: https://developer.sepay.vn/
 * SePay SDK: https://www.npmjs.com/package/sepay-pg-node
 */

class SePayService {
    constructor() {
        // Lấy từ environment variables - SePay sử dụng API Key/Secret
        this.apiKey = process.env.SEPAY_API_KEY || ''
        this.secretKey = process.env.SEPAY_SECRET_KEY || ''
        this.merchantId = process.env.SEPAY_MERCHANT_ID || '' // Optional, có thể không cần
        
        // SePay API endpoints
        this.baseUrl = process.env.SEPAY_API_URL || 'https://api.sepay.vn'
        this.sandboxUrl = process.env.SEPAY_SANDBOX_URL || 'https://sandbox.sepay.vn'
        this.isSandbox = process.env.SEPAY_SANDBOX === 'true' || process.env.SEPAY_ENV === 'sandbox' || !this.apiKey
        
        this.apiUrl = this.isSandbox ? this.sandboxUrl : this.baseUrl
        
        // Ngrok public URL cho IPN
        this.ngrokUrl = process.env.NGROK_URL || 'https://restrainingly-cabbagy-eliz.ngrok-free.dev'
        this.ipnPath = process.env.SEPAY_IPN_PATH || '/api/payment/sepay/ipn'
        this.ipnUrl = `${this.ngrokUrl}${this.ipnPath}`
        
        console.log('🔧 SePay Service Configuration:')
        console.log(`   Environment: ${this.isSandbox ? 'SANDBOX' : 'PRODUCTION'}`)
        console.log(`   API URL: ${this.apiUrl}`)
        console.log(`   IPN URL: ${this.ipnUrl}`)
        console.log(`   API Key: ${this.apiKey ? '✅ Set' : '❌ Not set'}`)
        console.log(`   Secret Key: ${this.secretKey ? '✅ Set' : '❌ Not set'}`)
        
        // Initialize SePay SDK client if available (optional)
        if (SePayPgClient && (this.merchantId || this.apiKey) && this.secretKey) {
            try {
                this.sdkClient = new SePayPgClient({
                    env: this.isSandbox ? 'sandbox' : 'production',
                    merchant_id: this.merchantId || this.apiKey, // Fallback to API key if no merchant ID
                    secret_key: this.secretKey
                })
                console.log('✅ SePay SDK client initialized')
            } catch (error) {
                console.error('❌ Error initializing SePay SDK:', error.message)
                this.sdkClient = null
            }
        } else {
            this.sdkClient = null
            if (!this.apiKey || !this.secretKey) {
                console.log('⚠️ SePay API Key/Secret not configured. Payment features will be limited.')
            }
        }
    }

    /**
     * Tạo checkout form fields sử dụng SePay SDK
     * @param {Object} paymentData - Thông tin thanh toán
     * @returns {Object} Checkout URL và form fields
     */
    createCheckoutForm(paymentData) {
        try {
            const {
                orderId,
                amount,
                description,
                returnUrl,
                cancelUrl,
                errorUrl,
                paymentMethod = 'BANK_TRANSFER'
            } = paymentData

            // Validate required fields
            if (!orderId || !amount || amount <= 0) {
                throw new Error('Order ID và amount là bắt buộc')
            }

            // Nếu có SDK client, sử dụng SDK
            if (this.sdkClient) {
                const checkoutURL = this.sdkClient.checkout.initCheckoutUrl()
                const checkoutFormFields = this.sdkClient.checkout.initOneTimePaymentFields({
                    payment_method: paymentMethod,
                    order_invoice_number: orderId,
                    order_amount: Math.round(amount), // SePay yêu cầu số nguyên
                    currency: 'VND',
                    order_description: description || `Thanh toán khóa học - Order ${orderId}`,
                    success_url: returnUrl || `${process.env.FRONTEND_URL || 'http://localhost:8080'}/payment/success?payment_id=${orderId}`,
                    error_url: errorUrl || `${process.env.FRONTEND_URL || 'http://localhost:8080'}/payment/cancel?payment_id=${orderId}`,
                    cancel_url: cancelUrl || `${process.env.FRONTEND_URL || 'http://localhost:8080'}/payment/cancel?payment_id=${orderId}`,
                })

                return {
                    success: true,
                    checkoutUrl: checkoutURL,
                    formFields: checkoutFormFields,
                    method: 'sdk'
                }
            }

            // Fallback: return mock data nếu không có SDK
            console.log('⚠️ SePay SDK not available, using mock checkout')
            return {
                success: true,
                checkoutUrl: `${process.env.FRONTEND_URL || 'http://localhost:8080'}/payment/success?payment_id=${orderId}&mock=true`,
                formFields: {},
                method: 'mock'
            }
        } catch (error) {
            console.error('❌ Create checkout form error:', error.message)
            throw error
        }
    }

    /**
     * Tạo payment link từ SePay (sử dụng SDK hoặc API)
     * @param {Object} paymentData - Thông tin thanh toán
     * @returns {Promise<Object>} Payment link và transaction info
     */
    async createPayment(paymentData) {
        try {
            const {
                orderId,
                amount,
                description,
                customerName,
                customerEmail,
                customerPhone,
                returnUrl,
                cancelUrl,
                webhookUrl
            } = paymentData

            // Validate required fields
            if (!orderId || !amount || amount <= 0) {
                throw new Error('Order ID và amount là bắt buộc')
            }

            // Nếu có SDK, sử dụng checkout form
            if (this.sdkClient) {
                const checkout = this.createCheckoutForm({
                    orderId,
                    amount,
                    description,
                    returnUrl,
                    cancelUrl
                })
                
                return {
                    success: true,
                    paymentUrl: checkout.checkoutUrl,
                    checkoutUrl: checkout.checkoutUrl,
                    formFields: checkout.formFields,
                    transactionId: `sepay_${Date.now()}`,
                    orderId: orderId,
                    qrCode: null,
                    expiresAt: new Date(Date.now() + 30 * 60 * 1000), // 30 phút
                    method: 'sdk'
                }
            }

            // Nếu không có SePay credentials, return mock payment URL để test
            if (!this.apiKey || this.isSandbox) {
                console.log('⚠️ SePay API key not configured, using mock payment URL')
                const mockPaymentUrl = `${process.env.FRONTEND_URL || 'http://localhost:8080'}/payment/success?payment_id=${orderId}&mock=true`
                return {
                    success: true,
                    paymentUrl: mockPaymentUrl,
                    transactionId: `mock_txn_${Date.now()}`,
                    orderId: orderId,
                    qrCode: null,
                    expiresAt: new Date(Date.now() + 30 * 60 * 1000), // 30 phút
                    method: 'mock'
                }
            }

            // SePay API request payload - Sử dụng API Key/Secret
            const payload = {
                api_key: this.apiKey, // SePay sử dụng API Key thay vì merchant_id
                order_id: orderId,
                amount: Math.round(amount), // SePay yêu cầu số nguyên (VND)
                currency: 'VND',
                description: description || `Thanh toán khóa học - Order ${orderId}`,
                customer_name: customerName || 'Khách hàng',
                customer_email: customerEmail || '',
                customer_phone: customerPhone || '',
                return_url: returnUrl || `${process.env.FRONTEND_URL || 'http://localhost:8080'}/payment/success`,
                cancel_url: cancelUrl || `${process.env.FRONTEND_URL || 'http://localhost:8080'}/payment/cancel`,
                ipn_url: webhookUrl || this.ipnUrl, // Sử dụng IPN URL từ ngrok
                // Optional: Expiration time (minutes)
                expire_time: 30 // 30 phút
            }

            console.log('📤 Creating SePay payment:', {
                orderId,
                amount,
                merchantId: this.merchantId,
                isSandbox: this.isSandbox
            })

            // Call SePay API - Sử dụng API Key/Secret để xác thực
            const headers = {
                'Content-Type': 'application/json',
                'X-API-Key': this.apiKey,
                'Authorization': `Bearer ${this.apiKey}`
            }
            
            // Nếu SePay yêu cầu signature trong header
            if (this.secretKey) {
                // Tạo signature từ payload và secret key (nếu SePay yêu cầu)
                const crypto = require('crypto')
                const payloadString = JSON.stringify(payload)
                const signature = crypto
                    .createHmac('sha256', this.secretKey)
                    .update(payloadString)
                    .digest('hex')
                headers['X-Signature'] = signature
            }
            
            console.log('📤 Calling SePay API:', {
                url: `${this.apiUrl}/v1/payments/create`,
                headers: { ...headers, 'X-API-Key': '***', 'Authorization': '***' },
                timeout: 10000 // 10 seconds timeout
            })
            
            // Wrap axios call với timeout để đảm bảo không treo
            const axiosCall = axios.post(
                `${this.apiUrl}/v1/payments/create`,
                payload,
                {
                    headers: headers,
                    timeout: 8000, // 8 seconds timeout - ngắn hơn để fail fast
                    validateStatus: (status) => status < 500 // Don't throw on 4xx
                }
            ).catch(err => {
                // Handle timeout và network errors
                if (err.code === 'ECONNABORTED' || err.message?.includes('timeout')) {
                    throw new Error('SePay API timeout after 8 seconds')
                }
                if (err.code === 'ECONNREFUSED' || err.code === 'ENOTFOUND') {
                    throw new Error('SePay API không thể kết nối. Vui lòng kiểm tra kết nối mạng.')
                }
                throw err
            })
            
            // Thêm timeout wrapper để đảm bảo không treo (double protection)
            const timeoutPromise = new Promise((_, reject) => {
                setTimeout(() => {
                    reject(new Error('SePay API timeout after 8 seconds'))
                }, 8000) // Giảm xuống 8s để fail faster
            })
            
            // Race between axios call and timeout
            const response = await Promise.race([axiosCall, timeoutPromise])
            
            // Verify response is valid
            if (!response || !response.data) {
                throw new Error('Invalid response from SePay API')
            }

            // Parse response - hỗ trợ nhiều format response từ SePay
            if (response.data) {
                // Format 1: { success: true, data: { payment_url, ... } }
                if (response.data.success && response.data.data) {
                    return {
                        success: true,
                        paymentUrl: response.data.data.payment_url || response.data.data.checkout_url,
                        checkoutUrl: response.data.data.checkout_url || response.data.data.payment_url,
                        formFields: response.data.data.form_fields || {},
                        transactionId: response.data.data.transaction_id || `sepay_${Date.now()}`,
                        orderId: response.data.data.order_id || orderId,
                        qrCode: response.data.data.qr_code || null,
                        expiresAt: response.data.data.expires_at ? new Date(response.data.data.expires_at) : new Date(Date.now() + 30 * 60 * 1000),
                        method: 'api'
                    }
                }
                
                // Format 2: { payment_url, transaction_id, ... } (direct)
                if (response.data.payment_url || response.data.checkout_url) {
                    return {
                        success: true,
                        paymentUrl: response.data.payment_url || response.data.checkout_url,
                        checkoutUrl: response.data.checkout_url || response.data.payment_url,
                        formFields: response.data.form_fields || {},
                        transactionId: response.data.transaction_id || `sepay_${Date.now()}`,
                        orderId: response.data.order_id || orderId,
                        qrCode: response.data.qr_code || null,
                        expiresAt: response.data.expires_at ? new Date(response.data.expires_at) : new Date(Date.now() + 30 * 60 * 1000),
                        method: 'api'
                    }
                }
                
                // Format 3: Error response
                throw new Error(response.data.message || response.data.error || 'Failed to create payment')
            }
            
            throw new Error('Invalid response from SePay API: no data')
        } catch (error) {
            console.error('❌ SePay create payment error:', error.message)
            console.error('Error name:', error.name)
            console.error('Error code:', error.code)
            if (error.response) {
                console.error('Response status:', error.response.status)
                console.error('Response data:', error.response.data)
                const errorMessage = error.response.data?.message || 
                                   error.response.data?.error || 
                                   `SePay API error (${error.response.status})`
                throw new Error(errorMessage)
            }
            // Re-throw với message rõ ràng
            throw error
        }
    }

    /**
     * Kiểm tra trạng thái thanh toán
     * @param {String} transactionId - SePay transaction ID
     * @returns {Promise<Object>} Payment status
     */
    async checkPaymentStatus(transactionId) {
        try {
            const response = await axios.get(
                `${this.apiUrl}/v1/payments/${transactionId}/status`,
                {
                    headers: {
                        'Authorization': `Bearer ${this.apiKey}`,
                        'X-API-Key': this.apiKey
                    },
                    timeout: 30000
                }
            )

            if (response.data && response.data.success) {
                return {
                    success: true,
                    status: response.data.data.status, // pending, completed, failed, cancelled
                    transactionId: response.data.data.transaction_id,
                    orderId: response.data.data.order_id,
                    amount: response.data.data.amount,
                    paidAt: response.data.data.paid_at || null,
                    paymentMethod: response.data.data.payment_method || null
                }
            } else {
                throw new Error(response.data?.message || 'Failed to check payment status')
            }
        } catch (error) {
            console.error('❌ SePay check status error:', error.message)
            if (error.response) {
                console.error('Response data:', error.response.data)
                throw new Error(error.response.data?.message || 'SePay API error')
            }
            throw error
        }
    }

    /**
     * Xác thực IPN/webhook signature từ SePay
     * SePay sử dụng API Key + Secret để xác thực
     * @param {Object} ipnData - IPN payload
     * @param {String} signature - IPN signature từ header
     * @returns {Boolean} Is valid
     */
    verifyWebhookSignature(ipnData, signature) {
        try {
            if (!this.secretKey) {
                console.warn('⚠️ Secret key not configured, skipping signature verification')
                return true // Skip verification nếu không có secret key (development only)
            }
            
            if (!signature) {
                console.warn('⚠️ No signature provided in IPN request')
                return false
            }
            
            // SePay sử dụng HMAC-SHA256 để ký IPN
            const crypto = require('crypto')
            
            // Tạo signature từ payload và secret key
            // SePay có thể sử dụng toàn bộ payload hoặc chỉ một phần
            const payloadString = JSON.stringify(ipnData)
            const expectedSignature = crypto
                .createHmac('sha256', this.secretKey)
                .update(payloadString)
                .digest('hex')
            
            // So sánh signature (case-insensitive)
            const isValid = crypto.timingSafeEqual(
                Buffer.from(signature.toLowerCase()),
                Buffer.from(expectedSignature.toLowerCase())
            )
            
            if (!isValid) {
                console.error('❌ Signature mismatch:')
                console.error('   Received:', signature)
                console.error('   Expected:', expectedSignature)
            }
            
            return isValid
        } catch (error) {
            console.error('❌ IPN signature verification error:', error.message)
            return false
        }
    }

    /**
     * Xử lý webhook/IPN callback từ SePay
     * @param {Object} webhookData - Webhook/IPN payload
     * @returns {Object} Parsed webhook data
     */
    parseWebhook(webhookData) {
        try {
            // Hỗ trợ nhiều format khác nhau từ SePay
            const transactionId = webhookData.transaction_id || 
                                 webhookData.transactionId || 
                                 webhookData.txn_id ||
                                 webhookData.id
            
            const orderId = webhookData.order_id || 
                           webhookData.orderId || 
                           webhookData.order_code ||
                           webhookData.payment_id
            
            const status = webhookData.status || 
                          webhookData.payment_status ||
                          webhookData.state
            
            const amount = parseFloat(webhookData.amount || webhookData.total_amount || 0)
            
            // Parse paid_at từ nhiều format
            let paidAt = null
            if (webhookData.paid_at) {
                paidAt = new Date(webhookData.paid_at)
            } else if (webhookData.paidAt) {
                paidAt = new Date(webhookData.paidAt)
            } else if (webhookData.completed_at) {
                paidAt = new Date(webhookData.completed_at)
            } else if (webhookData.timestamp) {
                paidAt = new Date(webhookData.timestamp)
            }

            return {
                transactionId: transactionId,
                orderId: orderId,
                status: status, // completed, failed, cancelled, pending, processing
                amount: amount,
                currency: webhookData.currency || webhookData.currency_code || 'VND',
                paidAt: paidAt,
                paymentMethod: webhookData.payment_method || 
                             webhookData.paymentMethod || 
                             webhookData.method || 
                             null,
                customerInfo: webhookData.customer_info || 
                             webhookData.customerInfo || 
                             webhookData.customer || 
                             {},
                metadata: webhookData.metadata || 
                         webhookData.extra_data || 
                         webhookData.additional_data || 
                         {},
                // Additional fields
                fee: webhookData.fee || 0,
                netAmount: webhookData.net_amount || amount,
                bankCode: webhookData.bank_code || null,
                bankName: webhookData.bank_name || null
            }
        } catch (error) {
            console.error('❌ Parse webhook error:', error.message)
            throw new Error(`Invalid webhook data format: ${error.message}`)
        }
    }
}

// Export singleton instance
module.exports = new SePayService()

