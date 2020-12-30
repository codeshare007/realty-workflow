using System;

namespace Realty.RecommendedListings.Input
{
    public enum MoveDirection
    { 
        Up = 1,
        Down = 2
    }

    public class MoveRecommendedListingInput
    {
        public Guid Id { get; set; }
        public MoveDirection Direction { get; set; }
    }
}
