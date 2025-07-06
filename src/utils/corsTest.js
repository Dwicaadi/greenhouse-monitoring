// Test CORS connectivity
const testCORS = async () => {
    const baseURL = 'https://api-iot.wibudev.moe';
    
    console.log('🧪 Testing CORS connectivity...');
    console.log('Base URL:', baseURL);
    console.log('Origin:', window.location.origin);
    
    try {
        // Test 1: Simple GET request
        console.log('\n📡 Test 1: Simple GET request');
        const response1 = await fetch(`${baseURL}/test-cors.php`, {
            method: 'GET',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            }
        });
        
        if (response1.ok) {
            const data1 = await response1.json();
            console.log('✅ GET request successful:', data1);
        } else {
            console.log('❌ GET request failed:', response1.status, response1.statusText);
        }
        
        // Test 2: OPTIONS preflight request
        console.log('\n📡 Test 2: OPTIONS preflight request');
        const response2 = await fetch(`${baseURL}/test-cors.php`, {
            method: 'OPTIONS',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            }
        });
        
        if (response2.ok) {
            console.log('✅ OPTIONS request successful:', response2.status);
        } else {
            console.log('❌ OPTIONS request failed:', response2.status, response2.statusText);
        }
        
        // Test 3: POST request
        console.log('\n📡 Test 3: POST request');
        const response3 = await fetch(`${baseURL}/test-cors.php`, {
            method: 'POST',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify({
                test: 'data',
                timestamp: new Date().toISOString()
            })
        });
        
        if (response3.ok) {
            const data3 = await response3.json();
            console.log('✅ POST request successful:', data3);
        } else {
            console.log('❌ POST request failed:', response3.status, response3.statusText);
        }
        
        // Test 4: API endpoint test
        console.log('\n📡 Test 4: API endpoint test');
        const response4 = await fetch(`${baseURL}/`, {
            method: 'GET',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            }
        });
        
        if (response4.ok) {
            const data4 = await response4.json();
            console.log('✅ API endpoint test successful:', data4);
        } else {
            console.log('❌ API endpoint test failed:', response4.status, response4.statusText);
        }
        
    } catch (error) {
        console.error('🔥 CORS test error:', error);
        console.error('Error details:', {
            message: error.message,
            stack: error.stack
        });
    }
};

// Run test when page loads
if (typeof window !== 'undefined') {
    window.testCORS = testCORS;
    console.log('🚀 CORS test function loaded. Run testCORS() to start testing.');
}

export default testCORS;
