#!/bin/bash

# Payment API Test Script
# Usage: ./test-payment.sh [course_id] [user_id]

BASE_URL="http://localhost:3000/api/payments"
COURSE_ID=${1:-"YOUR_COURSE_ID"}
USER_ID=${2:-"YOUR_USER_ID"}

echo "🧪 Payment API Test Script"
echo "================================"
echo ""

# Colors
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Test 1: Connectivity
echo -e "${YELLOW}Test 1: Testing API Gateway connectivity...${NC}"
GATEWAY_TEST=$(curl -s http://localhost:3000/test)
if echo "$GATEWAY_TEST" | grep -q "success"; then
    echo -e "${GREEN}✅ API Gateway is running${NC}"
else
    echo -e "${RED}❌ API Gateway is not running${NC}"
    exit 1
fi
echo ""

# Test 2: Course Service
echo -e "${YELLOW}Test 2: Testing Course Service connectivity...${NC}"
COURSE_TEST=$(curl -s http://localhost:3004/test)
if echo "$COURSE_TEST" | grep -q "success"; then
    echo -e "${GREEN}✅ Course Service is running${NC}"
else
    echo -e "${RED}❌ Course Service is not running${NC}"
    exit 1
fi
echo ""

# Test 3: Payment Route Info
echo -e "${YELLOW}Test 3: Testing Payment Route...${NC}"
PAYMENT_INFO=$(curl -s http://localhost:3000/api/payments)
if echo "$PAYMENT_INFO" | grep -q "success"; then
    echo -e "${GREEN}✅ Payment Route is accessible${NC}"
else
    echo -e "${RED}❌ Payment Route is not accessible${NC}"
    exit 1
fi
echo ""

# Test 4: Create Payment
echo -e "${YELLOW}Test 4: Creating payment...${NC}"
echo "Course ID: $COURSE_ID"
echo "User ID: $USER_ID"
echo ""

START_TIME=$(date +%s)
PAYMENT_RESPONSE=$(curl -s -w "\n%{http_code}" -X POST "$BASE_URL" \
  -H "Content-Type: application/json" \
  -d "{
    \"course_id\": \"$COURSE_ID\",
    \"user_id\": \"$USER_ID\",
    \"customer_name\": \"Test User\",
    \"customer_email\": \"test@example.com\",
    \"customer_phone\": \"0123456789\"
  }")
END_TIME=$(date +%s)
ELAPSED=$((END_TIME - START_TIME))

HTTP_CODE=$(echo "$PAYMENT_RESPONSE" | tail -n1)
BODY=$(echo "$PAYMENT_RESPONSE" | sed '$d')

echo "Response Time: ${ELAPSED}s"
echo "HTTP Status: $HTTP_CODE"
echo ""

if [ "$HTTP_CODE" -eq 200 ]; then
    echo -e "${GREEN}✅ Payment created successfully${NC}"
    echo "$BODY" | python3 -m json.tool 2>/dev/null || echo "$BODY"
    
    # Extract payment_id
    PAYMENT_ID=$(echo "$BODY" | grep -o '"payment_id":"[^"]*"' | cut -d'"' -f4)
    if [ -n "$PAYMENT_ID" ]; then
        echo ""
        echo -e "${YELLOW}Test 5: Getting payment status...${NC}"
        STATUS_RESPONSE=$(curl -s "$BASE_URL/$PAYMENT_ID/status")
        if echo "$STATUS_RESPONSE" | grep -q "success"; then
            echo -e "${GREEN}✅ Payment status retrieved${NC}"
            echo "$STATUS_RESPONSE" | python3 -m json.tool 2>/dev/null || echo "$STATUS_RESPONSE"
        else
            echo -e "${RED}❌ Failed to get payment status${NC}"
        fi
    fi
else
    echo -e "${RED}❌ Payment creation failed${NC}"
    echo "$BODY" | python3 -m json.tool 2>/dev/null || echo "$BODY"
    exit 1
fi

echo ""
echo -e "${GREEN}✅ All tests completed!${NC}"

