// Smart Budget Estimation and Multi-Category Expense Calculator

export const calculateBudget = (req, res) => {
  try {
    const {
      destination = 'Jaipur',
      travelersCount = 2,
      durationDays = 4,
      travelTier = 'Moderate', // Budget, Moderate, Luxury, Heritage Royal
      transitMode = 'Train', // Train, Flight, Private Cab, Self Drive
      accommodationType = '3-Star Hotel / Heritage Haveli'
    } = req.body;

    const travelers = Math.max(parseInt(travelersCount) || 1, 1);
    const days = Math.max(parseInt(durationDays) || 1, 1);

    // Multipliers
    let dailyStayPerPerson = 1200;
    let dailyFoodPerPerson = 600;
    let dailyLocalTransitPerPerson = 350;
    let dailyActivitiesPerPerson = 300;
    let intercityTravelPerPerson = 1500;

    switch (travelTier) {
      case 'Budget':
        dailyStayPerPerson = 700;
        dailyFoodPerPerson = 450;
        dailyLocalTransitPerPerson = 200;
        dailyActivitiesPerPerson = 150;
        intercityTravelPerPerson = transitMode === 'Flight' ? 4000 : 800;
        break;
      case 'Moderate':
        dailyStayPerPerson = 1600;
        dailyFoodPerPerson = 850;
        dailyLocalTransitPerPerson = 450;
        dailyActivitiesPerPerson = 400;
        intercityTravelPerPerson = transitMode === 'Flight' ? 5500 : 1800;
        break;
      case 'Luxury':
        dailyStayPerPerson = 4500;
        dailyFoodPerPerson = 2000;
        dailyLocalTransitPerPerson = 1200;
        dailyActivitiesPerPerson = 900;
        intercityTravelPerPerson = transitMode === 'Flight' ? 8500 : 3500;
        break;
      case 'Heritage Royal':
        dailyStayPerPerson = 9000;
        dailyFoodPerPerson = 3500;
        dailyLocalTransitPerPerson = 2500;
        dailyActivitiesPerPerson = 1800;
        intercityTravelPerPerson = transitMode === 'Flight' ? 12000 : 5000;
        break;
      default:
        break;
    }

    const totalStay = dailyStayPerPerson * days * travelers;
    const totalFood = dailyFoodPerPerson * days * travelers;
    const totalLocalTransit = dailyLocalTransitPerPerson * days * travelers;
    const totalIntercityTransit = intercityTravelPerPerson * travelers;
    const totalActivities = dailyActivitiesPerPerson * days * travelers;
    const shoppingAndBuffer = Math.round((totalStay + totalFood + totalActivities) * 0.12);

    const grandTotal = totalStay + totalFood + totalLocalTransit + totalIntercityTransit + totalActivities + shoppingAndBuffer;
    const perPersonCost = Math.round(grandTotal / travelers);

    res.json({
      success: true,
      data: {
        destination,
        travelersCount: travelers,
        durationDays: days,
        travelTier,
        transitMode,
        accommodationType,
        grandTotal,
        perPersonCost,
        breakdown: [
          { category: 'Stay & Accommodation', amount: totalStay, percentage: Math.round((totalStay / grandTotal) * 100), color: '#3B82F6' },
          { category: 'Intercity Travel & Flights/Trains', amount: totalIntercityTransit, percentage: Math.round((totalIntercityTransit / grandTotal) * 100), color: '#F59E0B' },
          { category: 'Food & Regional Cuisine', amount: totalFood, percentage: Math.round((totalFood / grandTotal) * 100), color: '#10B981' },
          { category: 'Local Commute & Cabs', amount: totalLocalTransit, percentage: Math.round((totalLocalTransit / grandTotal) * 100), color: '#8B5CF6' },
          { category: 'Entry Tickets & Guided Tours', amount: totalActivities, percentage: Math.round((totalActivities / grandTotal) * 100), color: '#EC4899' },
          { category: 'Shopping & Emergency Buffer', amount: shoppingAndBuffer, percentage: Math.round((shoppingAndBuffer / grandTotal) * 100), color: '#6366F1' }
        ],
        moneySavingTips: [
          "Book train/flight tickets at least 3-4 weeks ahead for cheapest tariffs.",
          "Use composite monument tickets in Jaipur, Agra, and Delhi to save up to 40% on entry fees.",
          "Eat where local families dine for the freshest food at half the tourist-hub price.",
          "Opt for shared battery rickshaws / e-rickshaws for short 1-3 km city hops.",
          "Check off-peak hotel discounts between Tuesday and Thursday."
        ]
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
