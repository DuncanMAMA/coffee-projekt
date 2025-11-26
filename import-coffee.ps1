# PowerShell CSV Import Script for Coffee Backlog
# Run with: .\import-coffee.ps1

$SUPABASE_URL = "https://tprjmnxyhcfonrtujdgf.supabase.co"
$SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRwcmptbnh5aGNmb25ydHVqZGdmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjM3NjI5MjgsImV4cCI6MjA3OTMzODkyOH0.7euP4JipRn07U8rxJ-SmfeXREfvCFWR5Z8qcKdoAi9s"

# Tasting note mapping
$TASTE_MAP = @{
    'SWEET' = 'Sweet'
    'ACIDIC' = 'Bright'
    'FLORAL' = 'Floral'
    'SPICE' = 'Spicy'
    'FERMENTED' = 'Funky'
    'BERRY FRUIT' = 'Berry'
    'CITRUS FRUIT' = 'Citrus'
    'STONE FRUIT' = 'Stone Fruit'
    'VEGETIVE' = 'Herbal'
    'CHOCOLATE' = 'Chocolate'
    'CARAMEL' = 'Caramel'
    'ROASTED' = 'Roasted'
    'BITTER' = 'Bitter'
    'SAVORY' = 'Savory'
}

$TAG_COLORS = @{
    'Sweet' = '#FFE5B4'
    'Bitter' = '#8B4513'
    'Fruity' = '#FF6B9D'
    'Nutty' = '#D2691E'
    'Chocolate' = '#6F4E37'
    'Caramel' = '#C68E17'
    'Floral' = '#E6B0FF'
    'Bright' = '#FFE135'
    'Citrus' = '#FFA500'
    'Berry' = '#8E4585'
    'Stone Fruit' = '#FFB347'
    'Herbal' = '#90EE90'
    'Spicy' = '#DC143C'
    'Funky' = '#9370DB'
    'Roasted' = '#654321'
    'Savory' = '#8B7355'
}

function Get-Top4TastingNotes {
    param($row, $headers)
    
    $tastingCols = @('SWEET', 'ACIDIC', 'FLORAL', 'SPICE', 'FERMENTED', 'BERRY FRUIT', 'CITRUS FRUIT', 'STONE FRUIT', 'VEGETIVE', 'CHOCOLATE', 'CARAMEL', 'ROASTED', 'BITTER', 'SAVORY')
    
    $scores = @()
    foreach ($col in $tastingCols) {
        $idx = [array]::IndexOf($headers, $col)
        if ($idx -ge 0) {
            $score = [int]$row[$idx]
            if ($score -gt 0) {
                $scores += [PSCustomObject]@{
                    Name = $TASTE_MAP[$col]
                    Score = $score
                }
            }
        }
    }
    
    $top4 = $scores | Sort-Object -Property Score -Descending | Select-Object -First 4 | Select-Object -ExpandProperty Name
    
    # Pad with defaults if needed
    $defaults = @('Sweet', 'Bitter', 'Fruity', 'Floral')
    while ($top4.Count -lt 4) {
        $next = $defaults | Where-Object { $top4 -notcontains $_ } | Select-Object -First 1
        if ($next) { $top4 += $next } else { break }
    }
    
    return $top4[0..3]
}

function Generate-Gradient {
    param($tags)
    
    $colors = $tags | ForEach-Object { if ($TAG_COLORS[$_]) { $TAG_COLORS[$_] } else { '#CCCCCC' } }
    return "radial-gradient(circle at 50% 50%, $($colors[0]), $($colors[1]), $($colors[2]), $($colors[3]))"
}

function Invoke-SupabaseAPI {
    param(
        [string]$Endpoint,
        [string]$Method = "GET",
        [object]$Body
    )
    
    $headers = @{
        "apikey" = $SUPABASE_ANON_KEY
        "Authorization" = "Bearer $SUPABASE_ANON_KEY"
        "Content-Type" = "application/json"
    }
    
    $uri = "$SUPABASE_URL/rest/v1/$Endpoint"
    
    if ($Method -eq "POST") {
        $response = Invoke-RestMethod -Uri $uri -Method $Method -Headers $headers -Body ($Body | ConvertTo-Json -Depth 10)
    } else {
        $response = Invoke-RestMethod -Uri $uri -Method $Method -Headers $headers
    }
    
    return $response
}

function Get-OrCreateRef {
    param([string]$tableName, [string]$name)
    
    if (-not $name) { return $null }
    
    try {
        $existing = Invoke-SupabaseAPI -Endpoint "$tableName`?name=eq.$name" -Method "GET"
        if ($existing -and $existing.Count -gt 0) {
            return $existing[0]
        }
        
        $newItem = Invoke-SupabaseAPI -Endpoint $tableName -Method "POST" -Body @{ name = $name }
        return $newItem[0]
    } catch {
        Write-Host "Error with $tableName - $name : $_" -ForegroundColor Red
        return $null
    }
}

Write-Host "`n🔥 Starting coffee import...`n" -ForegroundColor Cyan

# Read CSV files
$csv2024 = Import-Csv ".\Austen Coffee Journal - 2024.csv" -Header $null | Select-Object -Skip 2
$csv2025 = Import-Csv ".\Austen Coffee Journal - 2025.csv" -Header $null | Select-Object -Skip 2

# Get headers from line 2
$headers2024 = (Get-Content ".\Austen Coffee Journal - 2024.csv")[1] -split ',' | ForEach-Object { $_.Trim() }
$headers2025 = (Get-Content ".\Austen Coffee Journal - 2025.csv")[1] -split ',' | ForEach-Object { $_.Trim() }

$imported = 0
$errors = 0

# Process 2024 coffees
foreach ($line in (Get-Content ".\Austen Coffee Journal - 2024.csv" | Select-Object -Skip 2)) {
    if ([string]::IsNullOrWhiteSpace($line)) { continue }
    
    $row = $line -split ','
    
    $roasterName = $row[[array]::IndexOf($headers2024, 'ROASTER')].Trim()
    $coffeeName = $row[[array]::IndexOf($headers2024, 'NAME')].Trim()
    
    if (-not $roasterName -or -not $coffeeName) { continue }
    
    try {
        $originName = $row[[array]::IndexOf($headers2024, 'ORIGIN')].Trim()
        $regionName = $row[[array]::IndexOf($headers2024, 'REGION')].Trim()
        $processName = $row[[array]::IndexOf($headers2024, 'PROCESS')].Trim()
        $varietalName = $row[[array]::IndexOf($headers2024, 'VARIETAL')].Trim()
        $rating = $row[[array]::IndexOf($headers2024, 'OVERALL /10')].Trim()
        
        $tags = Get-Top4TastingNotes -row $row -headers $headers2024
        $gradient = Generate-Gradient -tags $tags
        
        $brewMethods = @()
        if ($row[[array]::IndexOf($headers2024, 'POUR OVER')]) { $brewMethods += 'Pour Over' }
        if ($row[[array]::IndexOf($headers2024, 'ESPRESSO')]) { $brewMethods += 'Espresso' }
        if ($brewMethods.Count -eq 0) { $brewMethods = @('Pour Over') }
        
        $location = @()
        if ($row[[array]::IndexOf($headers2024, 'HOME')]) { $location += 'Home' }
        if ($row[[array]::IndexOf($headers2024, 'CAFE')]) { $location += 'Café' }
        if ($location.Count -eq 0) { $location = @('Home') }
        
        $roaster = Get-OrCreateRef -tableName "roasters" -name $roasterName
        $origin = Get-OrCreateRef -tableName "origins" -name $originName
        $region = Get-OrCreateRef -tableName "regions" -name $regionName
        $process = Get-OrCreateRef -tableName "processes" -name $processName
        $varietal = Get-OrCreateRef -tableName "varietals" -name $varietalName
        
        $coffeeData = @{
            roaster_id = $roaster.id
            origin_id = if ($origin) { $origin.id } else { $null }
            region_id = if ($region) { $region.id } else { $null }
            process_id = if ($process) { $process.id } else { $null }
            varietal_id = if ($varietal) { $varietal.id } else { $null }
            name = $coffeeName
            brew_methods = $brewMethods -join ', '
            location = $location -join ', '
            rating = $rating
            tags = $tags
            gradient = $gradient
        }
        
        Invoke-SupabaseAPI -Endpoint "coffees" -Method "POST" -Body $coffeeData | Out-Null
        $imported++
        Write-Host "✓ Imported: $roasterName - $coffeeName (Rating: $rating)" -ForegroundColor Green
    } catch {
        $errors++
        Write-Host "✗ Error importing: $roasterName - $coffeeName : $_" -ForegroundColor Red
    }
}

# Process 2025 coffees (same logic)
foreach ($line in (Get-Content ".\Austen Coffee Journal - 2025.csv" | Select-Object -Skip 2)) {
    if ([string]::IsNullOrWhiteSpace($line)) { continue }
    
    $row = $line -split ','
    
    $roasterName = $row[[array]::IndexOf($headers2025, 'ROASTER')].Trim()
    $coffeeName = $row[[array]::IndexOf($headers2025, 'NAME')].Trim()
    
    if (-not $roasterName -or -not $coffeeName) { continue }
    
    try {
        $originName = $row[[array]::IndexOf($headers2025, 'ORIGIN')].Trim()
        $regionName = $row[[array]::IndexOf($headers2025, 'REGION')].Trim()
        $processName = $row[[array]::IndexOf($headers2025, 'PROCESS')].Trim()
        $varietalName = $row[[array]::IndexOf($headers2025, 'VARIETAL')].Trim()
        $rating = $row[[array]::IndexOf($headers2025, 'OVERALL /10')].Trim()
        
        $tags = Get-Top4TastingNotes -row $row -headers $headers2025
        $gradient = Generate-Gradient -tags $tags
        
        $brewMethods = @()
        if ($row[[array]::IndexOf($headers2025, 'POUR OVER')]) { $brewMethods += 'Pour Over' }
        if ($row[[array]::IndexOf($headers2025, 'ESPRESSO')]) { $brewMethods += 'Espresso' }
        if ($brewMethods.Count -eq 0) { $brewMethods = @('Pour Over') }
        
        $location = @()
        if ($row[[array]::IndexOf($headers2025, 'HOME')]) { $location += 'Home' }
        if ($row[[array]::IndexOf($headers2025, 'CAFE')]) { $location += 'Café' }
        if ($location.Count -eq 0) { $location = @('Home') }
        
        $roaster = Get-OrCreateRef -tableName "roasters" -name $roasterName
        $origin = Get-OrCreateRef -tableName "origins" -name $originName
        $region = Get-OrCreateRef -tableName "regions" -name $regionName
        $process = Get-OrCreateRef -tableName "processes" -name $processName
        $varietal = Get-OrCreateRef -tableName "varietals" -name $varietalName
        
        $coffeeData = @{
            roaster_id = $roaster.id
            origin_id = if ($origin) { $origin.id } else { $null }
            region_id = if ($region) { $region.id } else { $null }
            process_id = if ($process) { $process.id } else { $null }
            varietal_id = if ($varietal) { $varietal.id } else { $null }
            name = $coffeeName
            brew_methods = $brewMethods -join ', '
            location = $location -join ', '
            rating = $rating
            tags = $tags
            gradient = $gradient
        }
        
        Invoke-SupabaseAPI -Endpoint "coffees" -Method "POST" -Body $coffeeData | Out-Null
        $imported++
        Write-Host "✓ Imported: $roasterName - $coffeeName (Rating: $rating)" -ForegroundColor Green
    } catch {
        $errors++
        Write-Host "✗ Error importing: $roasterName - $coffeeName : $_" -ForegroundColor Red
    }
}

Write-Host "`n🎉 Import complete!" -ForegroundColor Cyan
Write-Host "✓ Successfully imported: $imported" -ForegroundColor Green
Write-Host "✗ Errors: $errors" -ForegroundColor Red
